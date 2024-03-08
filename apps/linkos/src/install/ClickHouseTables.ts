export default class ClickHouseTables {
    public static LinkosDatabase = `CREATE DATABASE IF NOT EXISTS linkos`;

    public static WebHooksLogs = `
        CREATE TABLE IF NOT EXISTS linkos.webhooks_logs
        (
            webhook_id  UInt64,
            status_code UInt16,
            response    Nullable(String),
            timestamp   DateTime('UTC')
        ) ENGINE = MergeTree()
      PRIMARY KEY (webhook_id, status_code, timestamp)
      TTL timestamp + INTERVAL 1 WEEK
    `;

    public static WebHooksExecutions = `
        CREATE TABLE IF NOT EXISTS linkos.webhooks_executions
        (
            webhook_id  UInt64,
            status_code UInt16,
            timestamp   DateTime('UTC')
        ) ENGINE = MergeTree()
      PRIMARY KEY (webhook_id, status_code, timestamp)
    `;

    public static TokenUsages = `
        CREATE TABLE IF NOT EXISTS linkos.token_usages
        (
            token_id  UInt64,
            endpoint  String,
            timestamp DateTime('UTC')
        ) ENGINE = MergeTree()
      PRIMARY KEY (token_id, endpoint, timestamp)
    `;

    public static LinkClicks = `
        CREATE TABLE IF NOT EXISTS linkos.links_clicks
        (
            link_id      UInt64,
            is_qr        Nullable(Bool),
            is_i         Nullable(Bool),
            is_plus_view Nullable(Bool),
            domain       String,
            country      String,
            city         Nullable(String),
            device_type  Nullable(String),
            device_brand Nullable(String),
            referer     Nullable(String),
            timestamp    DateTime('UTC')
        ) ENGINE = MergeTree()
      PRIMARY KEY (link_id, timestamp)
    `;

    public static Monitoring = `
        CREATE TABLE IF NOT EXISTS linkos.links_monitoring
        (
            link_id   UInt64,
            is_alive  Bool,
            timestamp DateTime('UTC')
        ) ENGINE = MergeTree()
      PRIMARY KEY (link_id, timestamp)
      TTL timestamp + INTERVAL 1 MONTH
    `;
}