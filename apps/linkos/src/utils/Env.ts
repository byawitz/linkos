import Global from "@/utils/Global.ts";

export default class Env {
    public static ENVIRONMENT_PRODUCTION  = 'production';
    public static ENVIRONMENT_DEVELOPMENT = 'development';

    public static ENVIRONMENT                = process.env.ENVIRONMENT ?? Env.ENVIRONMENT_PRODUCTION;
    public static PAGINATION_SIZE            = Global.ParseOrValue(process.env.PAGINATION_SIZE, 50);
    public static DEFAULT_LOCAL              = process.env.DEFAULT_LOCAL ?? '';
    public static TOKEN_DRIVER               = process.env.TOKEN_DRIVER ?? '';
    public static APP_SSL_KEY                = process.env.APP_SSL_KEY ?? '';
    public static API_ENDPOINT               = process.env.API_ENDPOINT ?? '';
    public static BACKUP_CRON                = process.env.BACKUP_CRON ?? '';
    public static NANOID_LETTERS             = process.env.NANOID_LETTERS ?? '';
    public static NANOID_LENGTH              = process.env.NANOID_LENGTH ?? '';
    public static KAFKA_NUMBER_OF_PARTITIONS = process.env.KAFKA_NUMBER_OF_PARTITIONS ?? '1';

    public static MAIN_DOMAIN      = process.env.MAIN_DOMAIN ?? '';
    public static MAIN_REDIRECT_TO = process.env.MAIN_REDIRECT_TO ?? '';

    public static APPWRITE_ENDPOINT   = process.env.APPWRITE_ENDPOINT ?? '';
    public static APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID ?? '';
    public static APPWRITE_API_KEY    = process.env.APPWRITE_API_KEY ?? '';

    public static REDIS_HOST = process.env.REDIS_HOST ?? '';
    public static REDIS_PORT = process.env.REDIS_PORT ?? '';

    public static KAFKA_HOSTS                              = process.env.KAFKA_HOSTS ?? '';
    public static KAFKA_CFG_NODE_ID                        = process.env.KAFKA_CFG_NODE_ID ?? '';
    public static KAFKA_CFG_PROCESS_ROLES                  = process.env.KAFKA_CFG_PROCESS_ROLES ?? '';
    public static KAFKA_CFG_CONTROLLER_QUORUM_VOTERS       = process.env.KAFKA_CFG_CONTROLLER_QUORUM_VOTERS ?? '';
    public static KAFKA_CFG_LISTENERS                      = process.env.KAFKA_CFG_LISTENERS ?? '';
    public static KAFKA_CFG_ADVERTISED_LISTENERS           = process.env.KAFKA_CFG_ADVERTISED_LISTENERS ?? '';
    public static KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP = process.env.KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP ?? '';
    public static KAFKA_CFG_CONTROLLER_LISTENER_NAMES      = process.env.KAFKA_CFG_CONTROLLER_LISTENER_NAMES ?? '';
    public static KAFKA_CFG_INTER_BROKER_LISTENER_NAME     = process.env.KAFKA_CFG_INTER_BROKER_LISTENER_NAME ?? '';

    public static CLICKHOUSE_HOST     = process.env.CLICKHOUSE_HOST ?? '';
    public static CLICKHOUSE_PORT     = process.env.CLICKHOUSE_PORT ?? '';
    public static CLICKHOUSE_DB       = process.env.CLICKHOUSE_DB ?? '';
    public static CLICKHOUSE_USER     = process.env.CLICKHOUSE_USER ?? '';
    public static CLICKHOUSE_PASSWORD = process.env.CLICKHOUSE_PASSWORD ?? '';

    public static POSTGRES_HOST     = process.env.POSTGRES_HOST ?? '';
    public static POSTGRES_PORT     = process.env.POSTGRES_PORT ?? '';
    public static POSTGRES_DB       = process.env.POSTGRES_DB ?? '';
    public static POSTGRES_USER     = process.env.POSTGRES_USER ?? '';
    public static POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD ?? '';
}