import {type Context, type Env, Hono} from "hono";
import type {BlankSchema} from "hono/types";
import API from "../../services/API.ts";

export default class General {
    static health(c: Context) {
        return c.json(API.response(true, {'powered-by': 'linkos'}))
    }
}