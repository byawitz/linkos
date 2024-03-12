import type {Context} from "hono";
import API from "../../services/API.ts";

export default class UserAPI {

    static forgot(c: Context) {
        return c.json(API.response())
    }

    static reset(c: Context) {
        return c.json(API.response())
    }
}