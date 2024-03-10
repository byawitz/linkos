import type {Context, Next} from "hono";
import Token from "../../models/db/Token.ts";
import API from "../../services/API.ts";
import {getCookie} from "hono/cookie";

export interface TokenOptions {
    headerName: string,
    skipIfSet: string,
}

export default class TokenMiddleware {
    public static getMiddleware(options: TokenOptions) {

        return async (c: Context, next: Next) => {
            if (getCookie(c, options.skipIfSet)) {
                await next();

                return;
            }

            const tokenKey = c.req.header(options.headerName);

            if (!tokenKey) {
                return c.json(API.response(false, {unauthorized: true}), 401);
            }

            const encrypted = Token.encrypt(tokenKey, process.env.APP_SSL_KEY ?? '');

            const user = await Token.getUser(encrypted);

            if (!user) {
                return c.json(API.response(false, {unauthorized: true}), 401);
            }

            c.set('user', user);
            //TODO: send event to Kafka for adding token usages to Clickhouse
            c.set('loginOkay', true);
            await next();
        }
    }

    private static badTokenResponse(c: Context, reason = 'Bad token') {
        return c.json({'Unauthorized': true, reason}, 401)
    }
}