import Log from "./Log.ts";
import {Hono} from "hono";
import API from "../commands/api/API.ts";
import Backup from "../commands/backup/Backup.ts";
import Install from "../commands/install/Install.ts";
import KafkaCommand from "../commands/kafka/KafkaCommand.ts";

/**
 * App main entry.
 *
 * Running any app command based on the cli-passed argument.
 */
export default class CLI {
    /**
     * Load the app
     */
    public static async main() {
        this.printLinkosLogo();

        if (Bun.argv.length <= 2) {
            CLI.printUsages();

            process.exit(-1);
        }

        switch (Bun.argv[2]) {
            case '-s':
            case '--serve':
                return API.init();

            case '-k':
            case '--kafka':
                return KafkaCommand.init();

            case '-b':
            case '--backup':
                Backup.init();
                return process.exit(0);

            case '-i':
            case '--install':
                await Install.init();
                return process.exit(0);

            default:
                CLI.printUsages();
        }
    }

    private static printLinkosLogo() {
        Log.instructions(`
██╗     ██╗███╗   ██╗██╗  ██╗ ██████╗ ███████╗
██║     ██║████╗  ██║██║ ██╔╝██╔═══██╗██╔════╝
██║     ██║██╔██╗ ██║█████╔╝ ██║   ██║███████╗
██║     ██║██║╚██╗██║██╔═██╗ ██║   ██║╚════██║
███████╗██║██║ ╚████║██║  ██╗╚██████╔╝███████║
╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝ 
----------------------------------------------                                                         
`);
    }

    private static printUsages() {
        Log.instructions('', 'Linkos usages');
        Log.instructions('', 'Commands:');
        Log.instructions('- Serve Linkos backend', '  -s --serve');
        Log.instructions('- Start Linkos Kafka consumer', '  -k --kafka');
        Log.instructions('- Install Linkos', '  -i --install');
        Log.instructions('- Run full backup', '  -b --backup');

        process.exit(-1);
    }
}