import {type Env, Hono} from "hono";
import type {BlankSchema} from "hono/types";

export default class Links {
    public static init(app: Hono<Env, BlankSchema, "/">) {
        app.post('/links/add', (c) => c.json({success: true}));
        app.get('/links/get/:id', (c) => c.json({success: true}));
        app.patch('/links/update/:id', (c) => c.json({success: true}));
        app.delete('/links/delete/:id', (c) => c.json({success: true}));
    }

}