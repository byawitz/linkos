import {type Context, type Env, Hono} from "hono";
import type {BlankSchema} from "hono/types";

/**
 * public link accessing route
 */
export default class Link {

    public static get(c: Context) {
        const {link} = c.req.param();

        // TODO: send Kafka events
        // - analytics
        // - for webhooks execution

        return c.json({a: link});
    }

    public static qr(c: Context) {
        const {link} = c.req.param();
        return c.json({a: link});
    }
}