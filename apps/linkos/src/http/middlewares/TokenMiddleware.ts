import type {Context, Next} from "hono";
import {HTTPException} from 'hono/http-exception'
import Token from "../../models/db/Token.ts";
import API from "../../services/API.ts";

export interface TokenOptions {
    headerName: string,
    allowWhenSet: string,
}

export default class TokenMiddleware {
    public static getMiddleware(options: TokenOptions) {

        return async (c: Context, next: Next) => {
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
            // To be used when Appwrite user will be added
            // As middleware
            c.set(options.allowWhenSet, true);

            //TODO: send event to Kafka for adding token usages to Clickhouse

            await next();
        }
    }

    private static badTokenResponse(c: Context, reason = 'Bad token') {
        return c.json({'Unauthorized': true, reason}, 401)
    }
}