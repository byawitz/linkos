import {createClient} from "@clickhouse/client-web";
import Log from "../../utils/Log.ts";
import type {WebClickHouseClient} from "@clickhouse/client-web/dist/client";

/**
 * ClickHouse Service
 *
 * Using the web client as the node version won't work with Bun.
 */
export default class ClickhouseService {
    private static client: WebClickHouseClient;

    public static async init() {
        try {
            if (!this.client)
                this.client = createClient({
                    host    : this.gethost(),
                    username: process.env.CLICKHOUSE_USER,
                    password: process.env.CLICKHOUSE_PASSWORD,
                })

            Log.good('Successfully connected to ClickHouse');

            process.on("SIGINT", async () => {
                if (this.client !== undefined)
                    await this.client.close();
            });
        } catch (e: any) {
            Log.error(e.message, 'Error connecting to ClickHouse');
        }
    }

    public static getClient() {
        return this.client;
    }

    public static async addLinkAnalyticsData() {

    }

    private static gethost() {
        return `${process.env.CLICKHOUSE_PROTOCOL}://${process.env.CLICKHOUSE_HOST}:${process.env.CLICKHOUSE_PORT}`;
    }
}