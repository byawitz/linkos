import {type Context} from "hono";
import Link from "@/models/db/Link.ts";
import RedisProvider from "@/providers/RedisProvider.ts";
import KafkaProvider from "@/providers/KafkaProvider.ts";
import Analytics from "@/services/Analytics.ts";
import type {Producer} from "kafkajs";
import AnalyticsMessage from "@/models/AnalyticsMessage.ts";
import Log from "@/utils/Log.ts";
import Global from "@/utils/Global.ts";
import Env from "@/utils/Env.ts";
import ClickMessage from "@/models/ClickMessage.ts";


export default class LinkAPI {
    private static producer: Producer | false;
    private static readonly path = '/usr/server/app/src/linkos/src/assets/';

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
        const {link} = c.req.param();

        try {
            let shortLink: false | Link;

            const linkFormRedis = await RedisProvider.getClient().get(link);
            if (linkFormRedis !== null) {
                shortLink = Global.ParseOrFalse(linkFormRedis);
            } else {
                shortLink = await Link.getLink(link);

                await RedisProvider.getClient().set(link, JSON.stringify(shortLink));
            }

            if (shortLink) {
                await LinkAPI.missions(shortLink, qr, c);

                return LinkAPI.redirect(this.appendQuery(shortLink.dest, c), c);
            }
        } catch (e: any) {
            Log.debug(e);
        }

        return c.html(await new Response(Bun.file(LinkAPI.path + "404.html")).text(), 404);
    }

    public static async getPublic(c: Context) {
        if (Env.MAIN_REDIRECT_TO !== '') {
            return LinkAPI.redirect(Env.MAIN_REDIRECT_TO, c);
        }

        return c.html(await new Response(Bun.file(LinkAPI.path + "linkos.html")).text());
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
        if (!link) return;

        const start = +new Date();

        if (LinkAPI.producer) {
            await LinkAPI.producer.send({
                topic   : Analytics.TOPIC_CLICKHOUSE,
                messages: [{value: (new AnalyticsMessage(link.id, qr, c.req.header())).toString()}]
            });

            await LinkAPI.producer.send({
                topic   : Analytics.TOPIC_POSTGRES,
                messages: [{value: (new ClickMessage(link.id)).toString()}]
            });

            // TODO: with soketi in realtime.
            // await LinkAPI.producer.send({topic: Analytics.TOPIC_SOKETI, messages: [{value: message.toString()}]});
        }

        Log.debug(`Kafka took ${(+new Date()) - start}ms`);
    }

    private static appendQuery(uri: string, c: Context) {
        try {
            const url = new URL(uri)

            for (const [key, value] of Object.entries(c.req.query())) {
                url.searchParams.append(key, value);
            }

            return url.href
        } catch {
            return uri;
        }
    }


}