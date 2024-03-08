import {Hono} from "hono";
import Log from "../utils/Log.ts";
import Links from "../http/api/Links.ts";
import {serveStatic} from "hono/bun";
import UserAPI from "../http/api/UserAPI.ts";
import General from "../http/api/General.ts";
import TokenMiddleware from "../http/middlewares/TokenMiddleware.ts";
import type User from "../models/db/User.ts";
import {cors} from "hono/cors";
import LevelMiddleware from "../http/middlewares/LevelMiddleware.ts";

export default class API {
    public static init() {
        Log.info('Starting serving Linkos')

        const app = new Hono({strict: false});

        app.use('/dashboard/*', serveStatic({root: './frontend',}));

        const api = app.route(process.env.API_ENDPOINT ?? '/v1/api');

        // TODO: Load another address from settings
        api.use('*', cors({origin: ['http://localhost:5173']}))

        api.post('/login', UserAPI.login);
        api.post('/reset', UserAPI.reset);
        api.post('/forgot', UserAPI.forgot);
        api.get('/health', General.health)

        const closedApi = api.use('*', TokenMiddleware.getMiddleware({headerName: 'x-linkos-token', allowWhenSet: 'user-is-authorized'}));
        closedApi.get('/whoami', General.whoAmI)

        closedApi.post('/links', LevelMiddleware.getMiddleware({level: 'writer'}), Links.add);
        closedApi.get('/links', LevelMiddleware.getMiddleware({level: 'reader'}), Links.list);
        closedApi.get('/links/:id', LevelMiddleware.getMiddleware({level: 'reader'}), Links.get);
        closedApi.get('/links/stat/:id/:days', LevelMiddleware.getMiddleware({level: 'reader'}), Links.getStats);
        closedApi.patch('/links/:id', LevelMiddleware.getMiddleware({level: 'editor'}), Links.patch);
        closedApi.delete('/links/:id', LevelMiddleware.getMiddleware({level: 'editor'}), Links.delete);


        return app;
    }

    public static response(success: boolean = false, data: Record<string, any> = {}) {
        return {success, data};
    }
}
