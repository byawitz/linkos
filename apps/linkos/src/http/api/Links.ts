import {type Context} from "hono";
import API from "../../services/API.ts";
import Link, {type MaybeLink} from "../../models/db/Link.ts";
import RedisProvider from "@/providers/RedisProvider.ts";
import ClickhouseProvider from "@/providers/ClickhouseProvider.ts";
import Global from "@/utils/Global.ts";
import Env from "@/utils/Env.ts";

export default class Links {
    public static async add(c: Context) {
        const newLink: Link = await c.req.json()

        const user      = c.get('user')
        newLink.user_id = user.id;

        if (newLink.short.trim() === '') {
            newLink.short = Link.generateShortSlug();
        }

        const link: MaybeLink = await Link.create(newLink)

        if (!link) {
            return c.json(API.response());
        }

        return c.json(API.response(true, link));
    }

    public static async getLinkStats(c: Context) {
        const {id, days} = c.req.param();

        const stats = await Link.getStats(parseInt(id), parseInt(days));

        if (!stats) {
            return c.json(API.response(false));
        }

        return c.json(API.response(true, stats));
    }

    public static async getLink(c: Context) {
        const {id} = c.req.param();

        const link: MaybeLink = await Link.getLink(id, 'id');

        if (!link) {
            return c.json(API.response());
        }

        return c.json(API.response(true, link));
    }

    public static async list(c: Context) {
        const last_id = Global.ParseOrValue(c.req.param().last_id);

        const links = await Link.getAll(Env.PAGINATION_SIZE, last_id);

        if (!links) {
            return c.json(API.response(false));
        }

        return c.json(API.response(true, Global.paginationObject(links, Env.PAGINATION_SIZE, last_id)));
    }

    public static async patch(c: Context) {
        const updatedLink: Link = await c.req.json()

        if (updatedLink.short.trim() === '') {
            updatedLink.short = Link.generateShortSlug();
        }

        const link: MaybeLink = await Link.update(updatedLink);

        if (link) {
            await RedisProvider.getClient().del(link.short)
            return c.json(API.response(true, link));
        }

        return c.json(API.response());
    }

    public static async delete(c: Context) {
        const {id, short}  = c.req.param()
        const deleteStatus = await Link.delete(id);

        if (deleteStatus) {
            await RedisProvider.getClient().del(short)
            await ClickhouseProvider.deleteForLink(id);

            return c.json(API.response(true))
        }

        return c.json(API.response());
    }

}