import Log from "../utils/Log.ts";
import KafkaProvider from "../providers/KafkaProvider.ts";
import RedisProvider from "../providers/RedisProvider.ts";
import ClickhouseProvider from "../providers/ClickhouseProvider.ts";

/**
 * App command:
 * Linkos --kafka starting point
 */
export default class Analytics {
    private static tries  = 1;
    static readonly TOPIC = 'linkos-analytics';
    static readonly GROUP = 'linkos-analytics-group';

    public static async init(): Promise<void> {
        Log.instructions('Starting Linkos Analytics Kafka consumer.');

        const consumer = await KafkaProvider.generateConsumer(this.TOPIC, this.GROUP);

        await consumer.run({
            eachBatch: async ({batch, resolveOffset, heartbeat, isRunning, isStale}) => {
                // Insert into Clickhouse and commit messages
                // Parse the message through the analytics model deserializer.
                for (let message of batch.messages) {
                    if (!isRunning() || isStale()) break

                    await ClickhouseProvider.addLinkAnalyticsData(/*message*/);
                    resolveOffset(message.offset);
                    await heartbeat();
                }
            }
        })
    }

}