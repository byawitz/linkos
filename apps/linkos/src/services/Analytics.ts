import Log from "../utils/Log.ts";
import KafkaProvider from "../providers/KafkaProvider.ts";
import RedisProvider from "../providers/RedisProvider.ts";
import ClickhouseProvider from "../providers/ClickhouseProvider.ts";
import AnalyticsMessage from "@/models/AnalyticsMessage.ts";
import PostgresProvider from "@/providers/PostgresProvider.ts";
import Link from "@/models/db/Link.ts";

export default class Analytics {
    private static tries  = 1;
    static readonly TOPIC = 'linkos-analytics';
    static readonly GROUP = 'linkos-analytics-group';

    public static async init(): Promise<void> {
        Log.instructions('Starting Linkos Analytics Kafka consumer.');

        const consumer = await KafkaProvider.generateConsumer(Analytics.TOPIC, Analytics.GROUP);

        await consumer.run({
            eachBatch: async ({batch, resolveOffset, heartbeat, isRunning, isStale}) => {
                // Insert into Clickhouse and commit messages
                // Parse the message through the analytics model deserializer.
                for (let message of batch.messages) {
                    if (!isRunning() || isStale()) break

                    if (message.value) {
                        try {
                            const aMessage = AnalyticsMessage.toJSON(message.value.toString());

                            const chInsert = await ClickhouseProvider.addLinkAnalyticsData(aMessage);
                            const pgUpdate = await Link.updateClicks(aMessage.linkId);

                            if (chInsert.executed) {
                                Log.debug('Clickhouse was inserted');
                                resolveOffset(message.offset);
                            }
                        } catch (e: any) {
                            Log.error(e);
                        }

                    }

                    await heartbeat();
                }
            }
        })
    }

}