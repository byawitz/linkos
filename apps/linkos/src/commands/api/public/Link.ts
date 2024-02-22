import {type Context, type Env, Hono} from "hono";
import type {BlankSchema} from "hono/types";

/**
 * public link accessing route
 */
export default class Link {
    public static init(app: Hono<Env, BlankSchema, "/">) {
        app.get('/:link', this.getLink);
        app.get('/qr/:link', this.getLinkByQR);

    }

    private static getLink(c: Context) {
        const {link} = c.req.param();
        return c.json({a: link});
    }

    private static getLinkByQR(c: Context) {
        const {link} = c.req.param();
        return c.json({a: link});
    }
}