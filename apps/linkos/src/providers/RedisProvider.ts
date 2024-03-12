import {createClient, type RedisClientType, type RedisDefaultModules, type RedisFunctions, type RedisModules, type RedisScripts} from 'redis';
import Log from "../utils/Log.ts";

/**
 * Redis Service
 */
export default class RedisProvider {
    private static client: RedisClientType<RedisDefaultModules & RedisModules, RedisFunctions, RedisScripts>;

    public static async init() {
        try {
            this.client = createClient({
                url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
            });

            this.client.on('error', err => console.log('Redis Client Error', err));
            await this.client.connect();

            process.on("SIGINT", async () => {
                if (this.client !== undefined)
                    await this.client.disconnect();
            });

            Log.good('Successfully connected to Redis');
        } catch (e) {
            Log.error('Conneting to Redis');
        }

    }

    public static getClient() {
        return this.client;
    }
}