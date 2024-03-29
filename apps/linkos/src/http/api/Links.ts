import {type Context} from "hono";
import API from "../../services/API.ts";
import Link, {type MaybeLink} from "../../models/db/Link.ts";
import RedisProvider from "@/providers/RedisProvider.ts";
import ClickhouseProvider from "@/providers/ClickhouseProvider.ts";
import Global from "@/utils/Global.ts";
import Env from "@/utils/Env.ts";
import PostgresProvider from "@/providers/PostgresProvider.ts";
import P from "@/providers/Providers.ts";

export default class Links {
    public static TABLE = 'links';

    public static async add(c: Context) {
        const newLink: Link = await c.req.json()

        const user      = c.get('user')
        newLink.user_id = user.id;

        if (newLink.short.trim() === '') newLink.short = Global.generateShortSlug();

        const link = await P.db(Links.TABLE).returning('*').insert(newLink);

        if (!link.length) {
            return c.json(API.response());
        }

        return c.json(API.response(true, link[0] as any));
    }

    public static async patch(c: Context) {
        const updatedLink: Link = await c.req.json()

        if (updatedLink.short.trim() === '') updatedLink.short = Global.generateShortSlug();

        const link: any = await P.db(Links.TABLE).returning('*').update(updatedLink).where('id', updatedLink.id);

        if (link.length) {
            await RedisProvider.getClient().del(link[0].short)
            return c.json(API.response(true, link[0]));
        }

        return c.json(API.response());
    }

    public static async getLink(c: Context) {
        const {id} = c.req.param();

        const link = await P.db(Links.TABLE)
            .where('links.id', id)
            .leftJoin('users', 'users.id', 'links.user_id')
            .leftJoin('campaigns', 'campaigns.id', 'links.campaign_id')
            .select('links.*', 'users.fullname as username', 'campaigns.title as campaign_title');

        if (!link.length) {
            return c.json(API.response());
        }

        return c.json(API.response(true, link[0]));
    }

    public static async getLinkStats(c: Context) {
        const {id, days} = c.req.param();

        const stats = await Link.getStats(parseInt(id), parseInt(days));

        if (!stats) {
            return c.json(API.response(false));
        }

        return c.json(API.response(true, stats));
    }

    public static async list(c: Context) {
        const last_id = Global.ParseOrValue(c.req.param().last_id);

        const query = P.db(Links.TABLE)
            .limit(Env.PAGINATION_SIZE + 1)
            .select('links.*')
            .orderBy('id', 'desc');

        if (last_id !== 0) {
            query.where('id', '<', last_id)
        }

        const links = await query;

        if (!links) {
            return c.json(API.response(false));
        }

        return c.json(API.response(true, Global.paginationObject(links, Env.PAGINATION_SIZE, last_id)));
    }


    public static async delete(c: Context) {
        const {id, short} = c.req.param();
        const deleted     = await P.db(Links.TABLE).where('id', id).del();

        if (deleted) {
            await RedisProvider.getClient().del(short)
            await ClickhouseProvider.deleteForLink(id);

            return c.json(API.response(true))
        }

        return c.json(API.response());
    }

}