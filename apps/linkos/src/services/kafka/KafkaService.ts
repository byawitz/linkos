import {type Consumer, Kafka, type Producer} from "kafkajs";

/**
 * Kafka Service
 *
 * In charge of initializing the kafka engine and
 * setting static versions of the producer and the consumer.
 */
export default class KafkaService {
    static readonly CLIENT_ID = 'linkos-kafka';
    static readonly TOPIC     = 'linkos-analytics';
    static readonly GROUP     = 'linkos-analytics-group';

    private static kafka?: Kafka       = undefined;
    private static producer?: Producer = undefined;
    private static consumer?: Consumer = undefined;

    public static init() {
        this.kafka = new Kafka({
            clientId: this.CLIENT_ID,
            brokers : ['kafka:9092'],
        })
    }

    public static async initProducer() {
        if (this.kafka === undefined) return false;

        if (this.producer !== undefined) return this.producer;

        this.producer = this.kafka.producer()

        await this.producer.connect()

        process.on("SIGINT", async () => {
            if (this.producer !== undefined)
                await this.producer.disconnect()
        });

        return this.producer;
    }

    public static async initConsumer() {
        if (this.kafka === undefined) return false;
        if (this.consumer !== undefined) return this.consumer;

        this.consumer = this.kafka.consumer({groupId: this.GROUP})

        await this.consumer.connect()
        await this.consumer.subscribe({topic: this.TOPIC, fromBeginning: true})

        process.on("SIGINT", async () => {
            if (this.consumer !== undefined)
                await this.consumer.disconnect();
        });

        return this.consumer;
    }

    public static async createTopic() {
        if (this.kafka === undefined) return false;
        const admin = this.kafka.admin();

        try {
            await admin.createTopics({topics: [{topic: this.TOPIC}]});
        } catch (e) {
            return false;
        }

        return true;
    }
}