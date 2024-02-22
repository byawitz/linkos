import Log from "../../utils/Log.ts";
import KafkaService from "../../services/kafka/KafkaService.ts";
import ClickhouseService from "../../services/clickhouse/ClickhouseService.ts";

export default class KafkaCommand {
    private static tries = 1;

    public static async init(): Promise<null> {
        Log.instructions('Starting Linkos Kafka consumer.');

        const consumer = await this.getConsumer();

        if (consumer === undefined) {
            return null;
        }

        await consumer.run({
            eachBatch: async ({batch, resolveOffset, heartbeat, isRunning, isStale}) => {
                // Insert into Clickhouse and commit messages
                // Parse the message through the analytics model deserializer.
                for (let message of batch.messages) {
                    if (!isRunning() || isStale()) break
                    await ClickhouseService.addLinkAnalyticsData(/*message*/);
                    resolveOffset(message.offset)
                    await heartbeat()
                }
            }
        })

        return null;
    }

    public static async getConsumer() {
        const consumer = await KafkaService.initConsumer();

        if (consumer === false) {
            if (this.tries == 6) {
                Log.error('Kafka Consumer is unreachable.');
                process.exit(-1);
            }

            Log.info('Kafka Consumer is unreachable, trying again in 2 seconds.');
            Log.info(`This is try number ${this.tries++}.`);
            setTimeout(this.getConsumer, 2000);
            return undefined;
        }

        return consumer;
    }


}