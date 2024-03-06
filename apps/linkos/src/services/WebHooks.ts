import Log from "../utils/Log.ts";
import KafkaProvider from "../providers/KafkaProvider.ts";
import RedisProvider from "../providers/RedisProvider.ts";
import ClickhouseProvider from "../providers/ClickhouseProvider.ts";

export default class WebHooks {
    private static tries  = 1;
    static readonly TOPIC = 'linkos-webhooks';
    static readonly GROUP = 'linkos-webhooks-group';

    public static async init(): Promise<void> {
        Log.instructions('Starting Linkos WebHook Kafka consumer.');

        const consumer = await KafkaProvider.generateConsumer(this.TOPIC, this.GROUP);

        await consumer.run({
            eachBatch: async (batch) => {
                for (let message of batch.batch.messages) {
                    if (!batch.isRunning() || batch.isStale()) break

                    batch.resolveOffset(message.offset);
                    await batch.heartbeat();
                }
            }
        })
    }

}