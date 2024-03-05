import {type Context, type Env, Hono} from "hono";
import type {BlankSchema} from "hono/types";
import Link from "@/models/db/Link.ts";
import RedisProvider from "@/providers/RedisProvider.ts";

/**
 * public link accessing route
 */
export default class LinkAPI {

    public static async get(c: Context) {
        const {link} = c.req.param();

        try {

            const linkFormRedis = await RedisProvider.getClient().get(link);
            if (linkFormRedis !== null) {
                const cachedLink: Link = JSON.parse(linkFormRedis);

                LinkAPI.missions(cachedLink);
                return c.redirect(cachedLink.dest, 301);
            }

            const dbLink = await Link.getLink(link);

            if (dbLink) {
                await RedisProvider.getClient().set(link, JSON.stringify(dbLink));

                LinkAPI.missions(dbLink);
                return c.redirect(dbLink.dest, 301);
            }
        } catch (e) {
        }

        // TODO: Return 404
        return c.json({Oops: '🤔🤔🤔🤔'});
    }


    private static missions(link: any) {
        // TODO: send Kafka events
        // - analytics
        // - for webhooks execution
        // - pass UTM
    }
}