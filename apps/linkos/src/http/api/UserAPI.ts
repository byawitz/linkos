import type {Context} from "hono";
import API from "../../services/API.ts";
import User from "@/models/db/User.ts";

export default class UserAPI {
    static async updateProfile(c: Context) {
        const user          = c.get('user');
        const {theme, lang} = await c.req.json();

        await User.setProfileOptions(user.email, theme, lang);

        return c.json(API.response(true));
    }

    static forgot(c: Context) {
        return c.json(API.response())
    }

    static reset(c: Context) {
        return c.json(API.response())
    }
}