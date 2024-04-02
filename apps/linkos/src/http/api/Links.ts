import {type Context} from "hono";
import API from "../../services/API.ts";
import Link, {type MaybeLink} from "../../models/db/Link.ts";
import RedisProvider from "@/providers/RedisProvider.ts";
import ClickhouseProvider from "@/providers/ClickhouseProvider.ts";
import Global from "@/utils/Global.ts";
import Env from "@/utils/Env.ts";
import PostgresProvider from "@/providers/PostgresProvider.ts";
import P from "@/providers/Providers.ts";
import BaseResource from "@/http/api/Base/BaseResource.ts";

export default class Links extends BaseResource {
    protected static TABLE            = 'links';
    protected static SELECTING_FIELDS = 'id,title,short,clicks,dest';
    protected static HAVE_CACHE       = true;
    protected static HAVE_STATS       = true;

    protected static modify(c: Context, link: Link): Link {
        const user   = c.get('user')
        link.user_id = user.id;

        if (link.short.trim() === '') link.short = Global.generateShortSlug();

        return link;
    }

    protected static async afterUpdate(resource: Link) {
        await RedisProvider.getClient().del(resource.short)
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
}