import App from "./App.ts";
import KafkaProvider from "./providers/KafkaProvider.ts";
import RedisProvider from "./providers/RedisProvider.ts";
import PostgresProvider from "./providers/PostgresProvider.ts";
import ClickhouseProvider from "./providers/ClickhouseProvider.ts";

App.printLinkosLogo();

// Modules init.
KafkaProvider.init();
await ClickhouseProvider.init();
await PostgresProvider.init();
await RedisProvider.init();

export default await App.main();