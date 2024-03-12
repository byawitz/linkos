import {createClient} from "@clickhouse/client-web";
import Log from "../utils/Log.ts";
import type {WebClickHouseClient} from "@clickhouse/client-web/dist/client";
import AnalyticsMessage from "@/models/AnalyticsMessage.ts";
import {UAParser} from 'ua-parser-js';
import CHQueries from "@/providers/queries/CHQueries.ts";

export default class ClickhouseProvider {
    /* Using the web client as the node version won't work with Bun. */
    private static client: WebClickHouseClient;

    public static async init() {
        try {
            if (!this.client)
                this.client = createClient({
                    host    : this.getHost(),
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


    public static async addLinkAnalyticsData(message: AnalyticsMessage) {
        const ua     = UAParser(message.userAgent);
        const client = ClickhouseProvider.getClient();

        return await client.insert({
            table : 'linkos.links_clicks',
            format: "JSONEachRow",
            values: [
                {
                    link_id     : parseInt(message.linkId),
                    is_qr       : message.qr,
                    is_i        : false, //TODO
                    is_plus_view: false,//TODO
                    domain      : message.host,
                    country     : 'USA',//TODO
                    referer     : message.referer,
                    timestamp   : new Date().toISOString().slice(0, -5),
                    city        : 'LA',//TODO
                    device_type : ua.device.type,
                    device_brand: ua.os.name
                }
            ],
        });
    }


    static async deleteForLink(id: string) {
        await ClickhouseProvider.getClient().exec({query: CHQueries.deleteForLinkID, query_params: {id: parseInt(id)},});
    }

    private static getHost() {
        return `${process.env.CLICKHOUSE_PROTOCOL}://${process.env.CLICKHOUSE_HOST}:${process.env.CLICKHOUSE_PORT}`;
    }
}