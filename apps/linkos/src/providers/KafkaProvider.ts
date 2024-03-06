import {type Consumer, Kafka, type Producer} from "kafkajs";
import Log from "../utils/Log.ts";
import Global from "../utils/Global.ts";

export default class KafkaProvider {
    static readonly CLIENT_ID = 'linkos-kafka';

    private static kafka?: Kafka       = undefined;
    private static producer?: Producer = undefined;

    public static init() {
        const hosts = (process.env.KAFKA_HOSTS ?? '').split(',');

        this.kafka = new Kafka({
            clientId: this.CLIENT_ID,
            brokers : hosts,
        })
    }

    public static getKafka() {
        return this.kafka;
    }

    public static async initProducer() {
        if (this.kafka === undefined) return false;

        this.producer = this.kafka.producer()

        await this.producer.connect()

        process.on("SIGINT", async () => {
            if (this.producer !== undefined)
                await this.producer.disconnect()
        });

        return this.producer;
    }



    public static async generateConsumer(topic: string, groupId: string): Promise<Consumer> {
        let tries = 0;

        while (true) {
            if (this.kafka !== undefined) {
                break;
            }

            if (tries >= 6) {
                Log.error('Kafka service is unreachable.');
                process.exit(-1);
            }

            Log.info('Kafka service is unreachable, trying again in 2 seconds.');
            Log.info(`This is try number ${tries++}.`);
            await Global.sleep(2000)
        }

        const consumer = this.kafka.consumer({groupId})

        await consumer.connect()
        await consumer.subscribe({topic, fromBeginning: true,})

        process.on("SIGINT", async () => {
            if (consumer !== undefined)
                await consumer.disconnect();
        });

        return consumer;
    }


}