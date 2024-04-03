import {type Context} from "hono";
import API from "../../../services/API.ts";
import RedisProvider from "@/providers/RedisProvider.ts";
import ClickhouseProvider from "@/providers/ClickhouseProvider.ts";
import Global from "@/utils/Global.ts";
import Env from "@/utils/Env.ts";
import P from "@/providers/Providers.ts";

export default class BaseResource {
    protected static TABLE            = 'table_name';
    protected static SELECTING_FIELDS = '*';
    protected static HAVE_CACHE       = false;
    protected static HAVE_STATS       = false;

    public static async add(c: Context) {
        const resourceData: any = this.modify(c, await c.req.json());

        const resource = await P.db(this.TABLE).returning('*').insert(resourceData);

        if (!resource.length) {
            return c.json(API.response());
        }

        return c.json(API.response(true, resource[0] as any));
    }

    public static async patch(c: Context) {
        const updatedResource: any = this.modify(c, await c.req.json());

        const resource: any = await P.db(this.TABLE).returning('*').update(updatedResource).where('id', updatedResource.id);

        if (resource.length) {
            await this.afterUpdate(resource[0]);
            return c.json(API.response(true, resource[0]));
        }

        return c.json(API.response());
    }

    public static async get(c: Context) {
        const {id} = c.req.param();

        const resource = await P.db(this.TABLE).where('id', id);

        if (!resource.length) {
            return c.json(API.response(), 404);
        }

        return c.json(API.response(true, resource[0]));
    }

    public static async list(c: Context) {
        const last_id = Global.ParseOrValue(c.req.param().last_id);

        const query = P.db(this.TABLE)
            .limit(Env.PAGINATION_SIZE + 1)
            .select(...this.SELECTING_FIELDS.split(','))
            .orderBy('id', 'desc');

        if (last_id !== 0) {
            query.where('id', '<', last_id)
        }

        const resources = await query;

        if (!resources) {
            return c.json(API.response(),404);
        }

        return c.json(API.response(true, Global.paginationObject(resources, Env.PAGINATION_SIZE, last_id)));
    }

    public static async delete(c: Context) {
        const {id, short} = c.req.param();
        const deleted     = await P.db(this.TABLE).where('id', id).del();

        if (deleted) {
            if (this.HAVE_CACHE) await RedisProvider.getClient().del(short)

            if (this.HAVE_STATS) await ClickhouseProvider.deleteForLink(id);

            return c.json(API.response(true))
        }

        return c.json(API.response());
    }

    protected static modify(c: Context, resource: any): any {
        return resource;
    }

    protected static async afterUpdate(resource: any) {
        /* Implement when needed */
    }

}