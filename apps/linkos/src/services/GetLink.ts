import {Hono} from "hono";
import Log from "../utils/Log.ts";
import LinkAPI from "../http/api/LinkAPI.ts";

export default class GetLink {
    public static async init() {
        Log.info('Starting serving Linkos getlink endpoint')

        const app = new Hono({strict: false});
        await LinkAPI.init();

        app.get('/:link', LinkAPI.get);
        app.get('/qr/:link', LinkAPI.getQr);

        return app;
    }
}
