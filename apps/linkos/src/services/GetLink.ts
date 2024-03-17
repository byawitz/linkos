import {Hono} from "hono";
import Log from "../utils/Log.ts";
import LinkAPI from "../http/api/LinkAPI.ts";

export default class GetLink {
    public static async init() {
        const app = new Hono({strict: false});
        await LinkAPI.init();

        app.get('/', LinkAPI.getPublic);
        app.get('/:link', LinkAPI.get);
        app.get('/qr/:link', LinkAPI.getQr);
        app.post('/password/:link', LinkAPI.getWithPassword);

        Log.info('Starting serving Linkos getlink endpoint')
        return app;
    }
}
