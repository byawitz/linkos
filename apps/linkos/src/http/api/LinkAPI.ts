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
import nunjucks from 'nunjucks';

export default class LinkAPI {
    private static producer: Producer | false;
    private static readonly path = '/usr/server/app/src/assets/';

    public static async init() {
        LinkAPI.producer = await KafkaProvider.initProducer();
    }

    public static async get(c: Context) {
        return LinkAPI.getRedirect(c);
    }

    public static getQr(c: Context) {
        return LinkAPI.getRedirect(c, true)
    }

    public static async getWithPassword(c: Context) {
        const {link} = c.req.param();

        const body     = await c.req.formData()
        const password = body.get('password');

        let shortLink = await LinkAPI.getLink(link);

        if (shortLink !== false && shortLink.password === password) {
            return LinkAPI.redirect(shortLink.dest, c);
        }

        return c.redirect(`${Env.MAIN_DOMAIN}/${link}`);
    }

    private static async getRedirect(c: Context, qr: boolean = false) {
        const {link} = c.req.param();

        try {
            let shortLink = await LinkAPI.getLink(link);

            if (shortLink) {
                await LinkAPI.missions(shortLink, qr, c);

                return LinkAPI.getLinkAction(shortLink, c, link);
            }
        } catch (e: any) {
            Log.debug(e);
        }


        return LinkAPI.its404(c);
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
            // TODO: check for informal, password, etc.
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


    private static async getLinkAction(link: Link, c: Context, linkId: string) {
        if (link.expiring_link && link.expiration_date !== undefined) {
            if (+new Date(link.expiration_date) < +new Date()) {
                return LinkAPI.its404(c);
            }
        }

        if (link.password_protected) {
            return c.html(LinkAPI.render('password', link));
        } else if (link.plus_enabled && linkId.endsWith('+')) {
            return c.html(LinkAPI.render('plus', link));
        } else if (link.informal_redirection) {
            return c.html(LinkAPI.render('i', link));
        }

        return LinkAPI.redirect(this.appendQuery(link.dest, c), c)
    }

    private static async render(page: string, link: Link) {
        const text = await (new Response(Bun.file(`${LinkAPI.path}${page}.html`))).text();

        return nunjucks.renderString(text, LinkAPI.linksContext(link));

    }


    private static linksContext(link: Link) {
        return {
            // TODO: Make language dynamic
            lang                     : 'en',
            dir                      : 'lrt',
            goto_text                : 'Go to',
            link_target_text         : 'Link destination',
            password_placeholder_text: 'e.g. Aa123456',
            enter_password_text      : 'Password is required to access this short link destination',
            form_target              : `${Env.MAIN_DOMAIN}/password/${link.id}`,


            title      : link.title,
            description: link.description,
            link       : link.dest,
        };
    }

    private static async getLink(linkID: string) {
        linkID = linkID.replace(/\+$/, '');

        let shortLink: false | Link = false;

        const linkFormRedis = await RedisProvider.getClient().get(linkID);
        if (linkFormRedis !== null) {
            shortLink = Global.ParseOrFalse(linkFormRedis);
        } else {
            shortLink = await Link.getLink(linkID);

            await RedisProvider.getClient().set(linkID, JSON.stringify(shortLink));
        }

        return shortLink;
    }

    private static async its404(c: Context) {
        return c.html(await new Response(Bun.file(LinkAPI.path + "404.html")).text(), 404);
    }
}