import Log from "./utils/Log.ts";
import API from "./services/API.ts";
import Backup from "./services/Backup.ts";
import Install from "./services/Install.ts";
import Analytics from "./services/Analytics.ts";
import GetLink from "./services/GetLink.ts";
import WebHooks from "./services/WebHooks.ts";
import Scheduler from "./services/Scheduler.ts";

export default class App {
    public static async main() {
        if (Bun.argv.length <= 2) {
            App.printUsages();

            process.exit(-1);
        }

        switch (Bun.argv[2]) {
            case '-s':
            case '--serve':
                return API.init();

            case '-l':
            case '--links':
                return GetLink.init();

            case '-w':
            case '--webhooks':
                return WebHooks.init();

            case '-a':
            case '--analytics':
                return Analytics.init();

            case '-sc':
            case '--scheduler':
                return Scheduler.init();

            case '-b':
            case '--backup':
                Backup.init();
                return process.exit(0);

            case '-i':
            case '--install':
                await Install.init();
                return process.exit(0);

            default:
                App.printUsages();
        }
    }

    public static printLinkosLogo() {
        Log.instructions(`██╗     ██╗███╗   ██╗██╗  ██╗ ██████╗ ███████╗\n ██║     ██║████╗  ██║██║ ██╔╝██╔═══██╗██╔════╝\n ██║     ██║██╔██╗ ██║█████╔╝ ██║   ██║███████╗\n ██║     ██║██║╚██╗██║██╔═██╗ ██║   ██║╚════██║\n ███████╗██║██║ ╚████║██║  ██╗╚██████╔╝███████║\n ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝\n  ----------------------------------------------\n `);
    }

    private static printUsages() {
        Log.instructions('', 'Linkos usages');
        Log.instructions('', 'Commands:');
        Log.instructions('- Serve Linkos backend', '  -s --serve');
        Log.instructions('- Serve Linkos any-link endpoint', '  -l --links');
        Log.instructions('- Start Linkos Kafka analytics consumer', '  -a --analytics');
        Log.instructions('- Start Linkos Kafka webhooks consumer', '  -w --webhooks');
        Log.instructions('- Start Linkos scheduler', '  -sc --scheduler');
        Log.instructions('- Install Linkos', '  -i --install');
        Log.instructions('- Run full backup', '  -b --backup');

        process.exit(-1);
    }
}