import {type Context, type Env, Hono} from "hono";
import type {BlankSchema} from "hono/types";

export default class Base {
    public static init(app: Hono<Env, BlankSchema, "/">) {
        app.get('/', (c) => {
            return c.json({'powered-by': 'linkos'})
        });

    }
}