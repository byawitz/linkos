import Log from "../utils/Log.ts";
import {Cron} from "croner";

export default class Scheduler {
    public static init() {
        Log.info('Starting Linkos scheduler cron process')

        const cron = process.env.BACKUP_CRON;

        if (!cron) {
            Log.error('You most specify cron expression in the BACKUP_CRON variable.')
            process.exit(-1);
        }

        Cron(cron, () => {
            //TODO: Backup
            Log.good(`Cron successfully finished at ${new Date().toISOString()}`);
        });
    }
}