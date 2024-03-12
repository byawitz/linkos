import Log from "../utils/Log.ts";
import KafkaProvider from "../providers/KafkaProvider.ts";
import ClickhouseProvider from "../providers/ClickhouseProvider.ts";
import AnalyticsMessage from "@/models/AnalyticsMessage.ts";
import Link from "@/models/db/Link.ts";
import type {EachBatchPayload, KafkaMessage} from "kafkajs";
import ClickMessage from "@/models/ClickMessage.ts";

export default class Analytics {
    private static tries             = 1;
    static readonly TOPIC_CLICKHOUSE = 'linkos-analytics-clickhouse';
    static readonly TOPIC_POSTGRES   = 'linkos-analytics-postgres';
    static readonly TOPIC_SOKETI     = 'linkos-analytics-soketi';

    public static async init(): Promise<void> {
        Log.instructions('Starting Linkos Analytics Kafka consumer.');

        await Promise.all([
            Analytics.initClickHouse(),
            Analytics.initPostgres()
        ]);
    }

    private static async consumerCallback(batcher: EachBatchPayload, cb: (msg: KafkaMessage) => Promise<void>) {

        for (let message of batcher.batch.messages) {
            if (!batcher.isRunning() || batcher.isStale()) break

            if (message && message.value) {
                await cb(message);
            }

            await batcher.heartbeat();
        }
    }

    private static async initClickHouse() {
        Log.debug('Starting Linkos Clickhouse consumer.');

        const consumer = await KafkaProvider.generateConsumer(Analytics.TOPIC_CLICKHOUSE, Analytics.TOPIC_CLICKHOUSE);

        await consumer.run({
            eachBatch: async (b) => {
                await Analytics.consumerCallback(b, async (msg) => {
                    const chInsert = await ClickhouseProvider.addLinkAnalyticsData(AnalyticsMessage.toJSON(msg.value!.toString()));

                    if (chInsert.executed) {
                        Log.debug('Clickhouse was inserted');
                        b.resolveOffset(msg.offset);
                    }
                });
            }
        })
    }

    private static async initPostgres() {
        Log.debug('Starting Linkos Postgres consumer.');

        const consumer = await KafkaProvider.generateConsumer(Analytics.TOPIC_POSTGRES, Analytics.TOPIC_POSTGRES);

        await consumer.run({
            eachBatch: async (b) => {
                await Analytics.consumerCallback(b, async (msg) => {
                    const aMessage = ClickMessage.toJSON(msg.value!.toString());

                    const pgUpdate = await Link.updateClicks(aMessage.linkId);

                    if (pgUpdate !== false) {
                        Log.debug('Postgres clicks incremented');
                        b.resolveOffset(msg.offset);
                    }
                });
            }
        })
    }
}