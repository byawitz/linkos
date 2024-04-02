import {Hono} from "hono";
import Log from "../utils/Log.ts";
import Links from "../http/api/Links.ts";
import {serveStatic} from "hono/bun";
import Users from "../http/api/Users.ts";
import General from "../http/api/General.ts";
import TokenMiddleware, {type TokenOptions} from "../http/middlewares/TokenMiddleware.ts";
import type User from "../models/db/User.ts";
import {cors} from "hono/cors";
import LevelMiddleware from "../http/middlewares/LevelMiddleware.ts";
import {type AppwriteAuthConfig, appwriteEmailLogin, appwriteMiddleware, initAppwrite} from "@/http/middlewares/AppwriteMiddleware.ts";
import Env from "@/utils/Env.ts";
import Campaigns from "@/http/api/Campaigns.ts";

export default class API {
    static readonly COOKIE                              = 'linkos_cookie';
    static readonly TOKEN                               = 'x-linkos-token';
    private static tokenSettings: TokenOptions          = {headerName: API.TOKEN, skipIfSet: API.COOKIE};
    private static appwriteSettings: AppwriteAuthConfig = {apiKey: Env.APPWRITE_API_KEY, endpoint: Env.APPWRITE_ENDPOINT, projectId: Env.APPWRITE_PROJECT_ID, cookieName: API.COOKIE};

    public static init() {
        const app = new Hono({strict: false});

        app.use('/dashboard/*', serveStatic({root: './frontend',}));

        const api = app.route(process.env.API_ENDPOINT ?? '/v1/api');

        // TODO: Load another address from settings
        api.use('*', cors({origin: 'http://localhost:5173', credentials: true,}));
        api.use('*', initAppwrite(API.appwriteSettings));


        api.get('/health', General.health);
        api.get('/server', General.server);
        api.post('/login', appwriteEmailLogin());

        const auth = api
            .use('*', TokenMiddleware.getMiddleware(API.tokenSettings))
            .use('*', appwriteMiddleware());

        const reader = auth.use('*', LevelMiddleware.getMiddleware({level: 'reader'}));
        const writer = auth.use('*', LevelMiddleware.getMiddleware({level: 'writer'}));
        const editor = auth.use('*', LevelMiddleware.getMiddleware({level: 'editor'}));

        auth.get('/whoami', General.whoAmI);
        auth.post('/user/update', Users.updateProfile);
        // api.post('/reset', UserAPI.reset);
        // api.post('/forgot', UserAPI.forgot);

        reader.get('/links/all/:last_id?/:prev?', (c) => Links.list(c));
        reader.get('/links/:id', (c) => Links.getLink(c));
        reader.get('/links/stat/:id/:days', (c) => Links.getLinkStats(c));

        writer.post('/links', (c) => Links.add(c));

        editor.patch('/links/:id', (c) => Links.patch(c));
        editor.delete('/links/:id/:short', (c) => Links.delete(c));

        reader.get('/campaigns/all/:last_id?/:prev?', (c) => Campaigns.list(c));
        reader.get('/campaigns/:id', (c) => Campaigns.get(c));

        writer.post('/campaigns', (c) => Campaigns.add(c));

        editor.patch('/campaigns/:id', (c) => Campaigns.patch(c));
        editor.delete('/campaigns/:id', (c) => Campaigns.delete(c));

        reader.get('/users/all/:last_id?/:prev?', (c) => Users.list(c));
        reader.get('/users/:id', (c) => Users.get(c));

        writer.post('/users', (c) => Users.add(c));

        editor.patch('/users/:id', (c) => Users.patch(c));
        editor.delete('/users/:id', (c) => Users.delete(c));

        Log.info('Starting serving Linkos');

        return app;
    }

    public static response(success: boolean = false, data: Record<string, any> = {}) {
        return {success, data};
    }
}
