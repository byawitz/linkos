import {type Context} from "hono";
import Link from "@/models/db/Link.ts";
import RedisProvider from "@/providers/RedisProvider.ts";
import KafkaProvider from "@/providers/KafkaProvider.ts";
import Analytics from "@/services/Analytics.ts";
import type {Producer} from "kafkajs";
import AnalyticsMessage from "@/models/AnalyticsMessage.ts";
import Log from "@/utils/Log.ts";


/**
 * public link accessing route
 */
export default class LinkAPI {
    private static producer: Producer | false;

    public static async init() {
        LinkAPI.producer = await KafkaProvider.initProducer();

    }


    public static async get(c: Context) {
        return LinkAPI.getRedirect(c);
    }

    public static getQr(c: Context) {
        return LinkAPI.getRedirect(c, true)
    }

    private static async getRedirect(c: Context, qr: boolean = false) {

        const {link}      = c.req.param();
        const appendQuery = LinkAPI.addUTM(c);
        try {

            const linkFormRedis = await RedisProvider.getClient().get(link);
            if (linkFormRedis !== null) {
                const cachedLink: Link = JSON.parse(linkFormRedis);
                await LinkAPI.missions(cachedLink, qr, c);

                return LinkAPI.redirect(cachedLink.dest + appendQuery, c);
            }

            const dbLink = await Link.getLink(link);

            if (dbLink) {
                await RedisProvider.getClient().set(link, JSON.stringify(dbLink));

                await LinkAPI.missions(dbLink, qr, c);
                return LinkAPI.redirect(dbLink.dest + appendQuery, c);
            }
        } catch (e) {
            // TODO
        }

        // TODO: Return 404
        return c.json({Oops: '🤔🤔🤔🤔'}, 404);

    }

    private static redirect(link: string, c: Context) {
        const text = `redirecting to ${link}`;

        return c.text(text, {
            status : 301,
            headers: {
                'content-length'         : text.length.toString(),
                'cache-control'          : 'private, max-age = 90',
                'content-security-policy': 'referrer always;',
                'location'               : link

            }
        })
    }

    private static async missions(link: Link | false, qr: boolean, c: Context) {
        const start = +new Date();

        const message = new AnalyticsMessage(link, qr, c.req.header('referer'), c.req.header('user-agent'), c.req.header('x-forwarded-for'), c.req.header('host'));
        if (LinkAPI.producer)
            await LinkAPI.producer.send({
                topic   : Analytics.TOPIC,
                messages: [{value: message.toString()}]
            });

        Log.debug(`Kafka took ${(+new Date()) - start}ms`);
    }


    private static addUTM(c: Context) {
        const {utm_content, utm_medium, utm_source, utm_campaign} = c.req.query();

        // Add UTM with & or ? by parsing the url
        if (utm_campaign && utm_content && utm_source && utm_medium) {
            return `?utm_content=${utm_content}&utm_medium=${utm_medium}&utm_source=${utm_source}&utm_campaign=${utm_campaign}`;
        }

        return ''
    }
}