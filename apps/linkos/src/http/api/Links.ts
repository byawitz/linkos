import {type Context, type Env, Hono} from "hono";
import type {BlankSchema} from "hono/types";
import API from "../../services/API.ts";
import Link from "../../models/db/Link.ts";

export default class Links {
    static add(c: Context) {
        return c.json(API.response())
    }

    static async get(c: Context) {
        const {id} = c.req.param();

        const link = await Link.getLink(id);

        if (!link) {
            return c.json(API.response(false));
        }

        return c.json(API.response(true, link));
    }

    static async list(c: Context) {
        // TODO: pagination
        const links = await Link.getAll();

        if (!links) {
            return c.json(API.response(false));
        }

        return c.json(API.response(true, links));
    }

    static patch(c: Context) {
        return c.json(API.response())
    }

    static delete(c: Context) {
        return c.json(API.response())
    }

}