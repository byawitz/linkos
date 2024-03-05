import type {Context, Next} from "hono";
import User from "../../models/db/User.ts";
import Log from "../../utils/Log.ts";
import type {UserLevel} from "@@/db/UserModel.ts";

export interface LevelOptions {
    level: UserLevel,
}

export default class LevelMiddleware {
    public static getMiddleware(options: LevelOptions) {

        return async (c: Context, next: Next) => {
            const user: User = c.get('user');

            // TODO
            Log.info(`user with level=${user.level} access resource level=${options.level}`)

            await next();
        }
    }

    private static badTokenResponse(c: Context, reason = 'Bad token') {
        return c.json({'Unauthorized': true, reason}, 401)
    }
}