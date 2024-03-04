import {type Context, type Env, Hono} from "hono";
import API from "../../services/API.ts";

export default class General {
    static health(c: Context) {
        return c.json(API.response(true, {'powered-by': 'linkos'}))
    }

    static whoAmI(c: Context) {
        const user = c.get('user');
        return c.json(API.response(true, {user}))
    }
}