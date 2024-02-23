import Log from "./utils/Log.ts";
import API from "./lib/api/API.ts";
import Backup from "./lib/backup/Backup.ts";
import Install from "./lib/install/Install.ts";
import KafkaCommand from "./lib/kafka/KafkaCommand.ts";

/**
 * App main entry.
 *
 * Running any app command based on the cli-passed argument.
 */
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
                App.printUsages();
        }
    }

    public static printLinkosLogo() {
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