import {type Context, type Env, Hono} from "hono";
import type {BlankSchema} from "hono/types";
import API from "../../services/API.ts";
import Link, {type MaybeLink} from "../../models/db/Link.ts";

export default class Links {
    static async add(c: Context) {
        const newLink: Link = await c.req.json()

        const user = c.get('user')
        newLink.user_id = user.id;

        if(newLink.short.trim() === ''){
            newLink.short = Link.generateShortSlug();
        }

        const link: MaybeLink = await Link.create(newLink)

        if (link) {
            return c.json(API.response(true, link));
        }

        return c.json(API.response());
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
        //TODO: delete set [Item].deleted as true and changing unique id to something random with the row id
        return c.json(API.response())
    }

}