import Log from "../../utils/Log.ts";
import KafkaService from "../../services/kafka/KafkaService.ts";

/**
 * App command:
 * Linkos --install starting point
 */
export default class Install {
    public static async init() {
        Log.instructions('Starting Linkos installation process.');

        Log.info('Creating PostgreSQL tables');
        Log.info('Creating ClickHouse tables');

        Log.info('Creating Kafka topic');
        if (await KafkaService.createTopic()) {
            Log.good('Kafka topic successfully created');
        }
    }
}