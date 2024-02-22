import {type Env, Hono, type Schema} from "hono";
import Log from "../../utils/Log.ts";
import type {BlankSchema, MergePath, MergeSchemaPath} from "hono/types";
import Base from "./public/Base.ts";
import Link from "./public/Link.ts";
import Links from "./private/Links.ts";

export default class API {
    public static init() {
        Log.info('Starting serving Linkos')

        const app = new Hono({strict: false});
        const api = app.route('/api/v1');

        this.setPublicRoutes(app);
        this.setPrivateRoutes(api);

        return app;
    }

    private static setPublicRoutes(app: Hono<Env, BlankSchema, "/">) {
        Base.init(app);
        Link.init(app);
    }

    private static setPrivateRoutes(api: Hono<Env, MergeSchemaPath<Schema, MergePath<"/", "/api/v1">> & BlankSchema, "/">) {
        Links.init(api);
    }
}