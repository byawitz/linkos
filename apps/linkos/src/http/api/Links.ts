import {type Context, type Env, Hono} from "hono";
import type {BlankSchema} from "hono/types";
import API from "../../services/API.ts";

export default class Links {
    static add(c: Context) {
        return c.json(API.response())
    }

    static get(c: Context) {
        return c.json(API.response())
    }

    static patch(c: Context) {
        return c.json(API.response())
    }

    static delete(c: Context) {
        return c.json(API.response())
    }

}