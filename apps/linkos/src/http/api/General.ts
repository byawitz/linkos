import {type Context, Hono} from "hono";
import API from "../../services/API.ts";
import Env from "@/utils/Env.ts";

export default class General {
    static health(c: Context) {
        return c.json(API.response(true, {'powered-by': 'linkos'}));
    }

    static server(c: Context) {
        return c.json(API.response(true, {server: {host: Env.MAIN_DOMAIN, lang: Env.DEFAULT_LOCAL}}));
    }

    static whoAmI(c: Context) {
        const user = c.get('user');
        return c.json(API.response(true, {user}));
    }
}