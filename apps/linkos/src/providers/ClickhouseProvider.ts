import {createClient} from "@clickhouse/client-web";
import Log from "../utils/Log.ts";
import type {WebClickHouseClient} from "@clickhouse/client-web/dist/client";
import AnalyticsMessage from "@/models/AnalyticsMessage.ts";
import {UAParser} from 'ua-parser-js';

/**
 * ClickHouse Service
 *
 * Using the web client as the node version won't work with Bun.
 */
export default class ClickhouseProvider {
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


    public static getLinkCountries() {
        return `SELECT DISTINCT on (country) country, count(*) as total
                FROM linkos.links_clicks
                WHERE link_id = {id: Int64}
                  AND timestamp >= now() - INTERVAL {days: Int32} DAY
                group by country
                ORDER BY total DESC
                LIMIT 10;`
    }

    public static getLinkReferrers() {
        return `SELECT DISTINCT on (referer) referer, count(*) as total
                FROM linkos.links_clicks
                WHERE link_id = {id: Int64}
                  AND timestamp >= now() - INTERVAL {days: Int32} DAY
                group by referer
                ORDER BY total DESC
                LIMIT 10;`;
    }

    public static getLinkCities() {
        return `SELECT DISTINCT on (city) city, count(*) as total
                FROM linkos.links_clicks
                WHERE link_id = {id: Int64}
                  AND timestamp >= now() - INTERVAL {days: Int32} DAY
                group by city
                ORDER BY total DESC
                LIMIT 10;`
    }

    public static getLinkClickAndDevices() {
        return `SELECT count(*)                                                                                                                                  as clicks,
                       sum(is_qr = false)                                                                                                                        as direct,
                       sum(is_qr)                                                                                                                                as qr,
                       sum(device_type like 'mobile' AND isNotNull(device_type))                                                                                 as mobile,
                       sum(device_type not like 'mobile' AND isNotNull(device_type))                                                                             as unknown_type,
                       sum(isNull (device_type))                                                                                                                 as desktop,
                       sum(lower(device_brand) LIKE 'apple' AND isNotNull(device_brand))                                                                         as apple,
                       sum(lower(device_brand) LIKE 'android' AND isNotNull(device_brand))                                                                       as android,
                       sum(isNull (device_brand) OR (lower(links_clicks.device_brand) not like 'apple' AND lower(links_clicks.device_brand) not like 'android')) as unknown_brand,
                       toMonth(timestamp)                                                                                                                        AS month,
                       toDayOfMonth(timestamp)                                                                                                                   AS day
                FROM linkos.links_clicks
                WHERE link_id = {id: Int64}
                  AND timestamp >= now() - INTERVAL {days : Int32} DAY
                GROUP BY month, day
                ORDER BY day, month;`
    }

    private static gethost() {
        return `${process.env.CLICKHOUSE_PROTOCOL}://${process.env.CLICKHOUSE_HOST}:${process.env.CLICKHOUSE_PORT}`;
    }
}