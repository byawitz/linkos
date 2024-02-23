/*************************************************
 ██╗     ██╗███╗   ██╗██╗  ██╗ ██████╗ ███████╗
 ██║     ██║████╗  ██║██║ ██╔╝██╔═══██╗██╔════╝
 ██║     ██║██╔██╗ ██║█████╔╝ ██║   ██║███████╗
 ██║     ██║██║╚██╗██║██╔═██╗ ██║   ██║╚════██║
 ███████╗██║██║ ╚████║██║  ██╗╚██████╔╝███████║
 ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
 ----------------------------------------------
 ************************************************/

import App from "./App.ts";
import KafkaService from "./packages/kafka/KafkaService.ts";
import RedisService from "./packages/redis/RedisService.ts";
import PostgresService from "./packages/postgres/PostgresService.ts";
import ClickhouseService from "./packages/clickhouse/ClickhouseService.ts";

App.printLinkosLogo();

// Modules init.
KafkaService.init();
ClickhouseService.init();
await PostgresService.init();
await RedisService.init();

export default await App.main();