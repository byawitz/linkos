import {Client} from 'pg';
import Log from "../utils/Log.ts";

export default class PostgresProvider {
    private static client?: Client;

    public static async init() {
        if (this.client) return;

        try {
            this.client = new Client({
                host    : process.env.POSTGRES_HOST,
                database: process.env.POSTGRES_DB,
                user    : process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
            })

            await this.client.connect()

            Log.good('Successfully connected to Postgres');

            process.on("SIGINT", async () => {
                if (this.client !== undefined)
                    await this.client.end();
            });
        } catch (e: any) {
            Log.error(e.message, 'Error connecting to Postgres:');
            process.exit(-1);
        }
    }

    public static getClient(): Client | null {
        if (!this.client) {
            Log.error('Postgres client is not available')
            return null
        }
        return this.client;
    }
}