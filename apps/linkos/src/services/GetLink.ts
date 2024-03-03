import {Hono} from "hono";
import Log from "../utils/Log.ts";
import Links from "../http/api/Links.ts";
import {serveStatic} from "hono/bun";
import UserAPI from "../http/api/UserAPI.ts";
import General from "../http/api/General.ts";
import Link from "../http/api/Link.ts";

export default class GetLink {
    public static init() {
        Log.info('Starting serving Linkos getlink endpoint')

        const app = new Hono({strict: false});

        app.get('/:link', Link.get);
        app.get('/qr/:link', Link.qr);

        return app;
    }
}
