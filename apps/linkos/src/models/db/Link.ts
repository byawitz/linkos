import PostgresProvider from "../../providers/PostgresProvider.ts";
import Log from "../../utils/Log.ts";
import LinkModel from "@@/db/LinkModel.ts";
import {customAlphabet} from 'nanoid';
import Env from "@/utils/Env.ts";
import ClickhouseProvider from "@/providers/ClickhouseProvider.ts";
import CHQueries from "@/providers/queries/CHQueries.ts";

declare type MaybeLink = LinkModel | boolean;

export type {MaybeLink};
export default class Link extends LinkModel {

    public static async getStats(id: number, days: number) {
        try {
            const ch = ClickhouseProvider.getClient();

            const basic     = await ch.query({format: 'JSONEachRow', query: CHQueries.getLinkClickAndDevices(), query_params: {id, days}});
            const cities    = await ch.query({format: 'JSONEachRow', query: CHQueries.getTopGroup('city'), query_params: {id, days}});
            const countries = await ch.query({format: 'JSONEachRow', query: CHQueries.getTopGroup('country'), query_params: {id, days}});
            const referrers = await ch.query({format: 'JSONEachRow', query: CHQueries.getTopGroup('referer'), query_params: {id, days}});

            return {
                basic    : await basic.json(),
                cities   : await cities.json(),
                countries: await countries.json(),
                referrers: await referrers.json(),
            };

        } catch (e: any) {
            Log.debug(e)
        }

        return false;
    }

    public static async getLink(id: string, by = 'short') {
        try {
            const pg = PostgresProvider.getClient();

            const text   = `
                SELECT l.*, u.fullname as username, c.title as campaign_title
                FROM links l
                         LEFT JOIN users u ON u.id = l.user_id
                         LEFT JOIN campaigns c ON c.id = l.campaign_id
                WHERE l.${by} = $1
            `
            const values = [id]

            const res = await pg?.query<Link>(text, values);
            if (res) {
                return res.rows[0];
            }
        } catch (e: any) {
            Log.error(e);
        }

        return false;
    }

    static async updateClicks(id: string) {
        try {
            const pg = PostgresProvider.getClient();

            const text   = `UPDATE links
                            set clicks     = clicks + 1,
                                updated_at = $1
                            WHERE id = $2
                            RETURNING *`
            const values = [new Date(), parseInt(id)];

            const res = await pg?.query<Link>(text, values);
            if (res) {
                return res.rows[0];
            }
        } catch (e: any) {
            Log.error(e);
        }

        return false;
    }
}