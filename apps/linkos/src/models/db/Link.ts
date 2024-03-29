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

    public static async create(link: Link) {
        try {
            const pg = PostgresProvider.getClient();

            const text   = 'INSERT INTO links( dest, description, short, password, title, user_id, campaign_id, password_protected, expiring_link, informal_redirection, monitor, plus_enabled, expiration_date) ' +
                'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *'
            const values = this.updateValues(link);

            const res = await pg?.query<Link>(text, values);

            if (res) {
                return res.rows[0];
            }
        } catch (e: any) {
            Log.debug(e);
        }

        return false;
    }

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

    public static async getAll(pageSize = 51, lastId = 0) {

        try {
            const values = [];
            if (lastId !== 0) {
                values.push(lastId);
            }

            const pg  = PostgresProvider.getClient();
            const res = await pg?.query<Link>(`SELECT id, title, short, dest, clicks
                                               FROM links ${lastId !== 0 ? 'WHERE id < $1' : ''}
                                               ORDER BY id DESC
                                               LIMIT ${pageSize + 1}`, values);
            if (res) {
                return res.rows;
            }
        } catch (e: any) {
            Log.error(e);
        }

        return false;
    }

    public static generateShortSlug(): string {
        return customAlphabet(Env.NANOID_LETTERS, parseInt(Env.NANOID_LENGTH))()
    }

    static async update(link: Link) {
        try {
            const pg = PostgresProvider.getClient();

            const text   = `UPDATE links
                            set dest                 = $1,
                                description          = $2,
                                short                = $3,
                                password             = $4,
                                title                = $5,
                                user_id              = $6,
                                campaign_id          = $7,
                                password_protected   = $8,
                                expiring_link        = $9,
                                informal_redirection = $10,
                                monitor              = $11,
                                plus_enabled         = $12,
                                expiration_date      = $13,
                                updated_at           = $14
                            WHERE id = $15
                            RETURNING *`
            const values = [...this.updateValues(link), new Date(), link.id];

            const res = await pg?.query<Link>(text, values);

            if (res) {
                return res.rows[0];
            }
        } catch (e: any) {
            Log.error(e);
        }

        return false;
    }

    public static async delete(id: string) {
        try {
            const pg = PostgresProvider.getClient();

            const text   = `DELETE
                            FROM links
                            WHERE id = $1`
            const values = [id];

            const res = await pg?.query<Link>(text, values);

            if (res) {
                return true;
            }
        } catch (e: any) {
            Log.error(e);
        }

        return false;
    }

    private static updateValues(link: Link) {
        return [link.dest, link.description, link.short, link.password, link.title, link.user_id, link.campaign_id, link.password_protected, link.expiring_link, link.informal_redirection, link.monitor, link.plus_enabled, link.expiration_date];

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