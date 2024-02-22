import {type Env, Hono, type Schema} from "hono";
import Log from "../../utils/Log.ts";
import type {BlankSchema, MergePath, MergeSchemaPath} from "hono/types";
import Base from "./public/Base.ts";
import Link from "./public/Link.ts";
import Links from "./private/Links.ts";
import SessionMiddleware from "../../middlewares/session/SessionMiddleware.ts";

/**
 * App command:
 * Linkos --serve starting point
 */
export default class API {
    public static init() {
        Log.info('Starting serving Linkos')

        const app = new Hono({strict: false});
        const api = app.route('/api/v1');

        this.setPublicRoutes(app);
        this.setPrivateRoutes(api);

        return app;
    }

    /**
     * Public routes are accessible by anyone
     * and don't require any authorization.
     *
     * @param app
     * @private
     */
    private static setPublicRoutes(app: Hono<Env, BlankSchema, "/">) {
        Base.init(app);
        Link.init(app);
    }

    /**
     * Private routes are accessible only with
     * cookie or token.
     *
     * @param app
     * @private
     */
    private static setPrivateRoutes(api: Hono<Env, MergeSchemaPath<Schema, MergePath<"/", "/api/v1">> & BlankSchema, "/">) {
        api.use('*', SessionMiddleware.getMiddleware());

        Links.init(api);
    }

}
