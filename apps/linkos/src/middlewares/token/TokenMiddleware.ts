import type {Context, Next} from "hono";
import TokenOptions from "./Models/TokenOptions.ts";

/**
 * Token middleware
 *
 * Handling and authorizing API requests
 * based on token.
 */
export default class TokenMiddleware {
    public static getMiddleware(options: TokenOptions = new TokenOptions()) {

        return async (c: Context, next: Next) => {
            const tokenKey = c.req.header(options.headerName);

            if (!tokenKey) {
                return this.badTokenResponse(c);
            }

            const token = await options.adapter.getToken(tokenKey);

            if (!token) {
                return this.badTokenResponse(c);
            }

            if (token.expirationDate.getTime() < new Date().getTime()) {
                return this.badTokenResponse(c, 'Token expired');
            }

            //TODO: send event to Kafka for adding token usages to Clickhouse
        }
    }

    private static badTokenResponse(c: Context, reason = 'Bad token') {
        return c.json({'Unauthorized': true, reason}, 401)
    }
}