import {Hono} from "hono";
import Log from "../utils/Log.ts";
import Links from "../http/api/Links.ts";
import {serveStatic} from "hono/bun";
import UserAPI from "../http/api/UserAPI.ts";
import General from "../http/api/General.ts";
import TokenMiddleware from "../http/middlewares/TokenMiddleware.ts";
import type User from "../models/db/User.ts";

export default class API {
    public static init() {
        Log.info('Starting serving Linkos')

        const app = new Hono({strict: false});

        app.use('/dashboard/*', serveStatic({root: './frontend',}));

        const api = app.route(process.env.API_ENDPOINT ?? '/v1/api');

        api.post('/login', UserAPI.login);
        api.post('/reset', UserAPI.reset);
        api.post('/forgot', UserAPI.forgot);
        api.get('/health', General.health)

        const closedApi = api.use('*', TokenMiddleware.getMiddleware({headerName: 'x-linkos-token', allowWhenSet: 'user-is-authorized'}));
        closedApi.get('/whoami', General.whoami)

        closedApi.post('/links/add', Links.add);
        closedApi.get('/links/get/:id', Links.get);
        closedApi.patch('/links/update/:id', Links.patch);
        closedApi.delete('/links/delete/:id', Links.delete);


        return app;
    }

    public static response(success: boolean = false, data: Record<string, any> = {}) {
        return {success, data};
    }
}
