import type {Context, Next} from "hono";

/**
 * Session middleware
 *
 * Handling and authorizing API requests
 * based on cookie and session.
 */
export default class SessionMiddleware {
    public static getMiddleware() {
        return async (c: Context, next: Next) => {
            const json = await c.req.json();
        }
    }
}