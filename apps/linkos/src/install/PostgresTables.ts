export default class PostgresTables {
    public static UsersEnum          = `CREATE TYPE userlevel AS ENUM ('owner', 'admin', 'editor','writer','reader');`;
    public static DeviceType         = `CREATE TYPE devicetype AS ENUM ('desktop', 'mobile', 'other');`;
    public static DeviceBrand        = `CREATE TYPE devicebrand AS ENUM ('apple', 'android', 'other');`;
    public static WebHookContentType = `CREATE TYPE webhookcontenttype AS ENUM ('json', 'form');`;

    public static Users = `
        CREATE TABLE IF NOT EXISTS users
        (
            id         BIGSERIAL PRIMARY KEY,

            email      VARCHAR(255) UNIQUE NOT NULL,
            fullname   VARCHAR(255) NULL,
            lang       VARCHAR(2) NULL,
            
            level      userlevel default 'reader',
            
            dark_theme  BOOLEAN   NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP NULL
        );
    `

    public static Campaigns = `
        CREATE TABLE IF NOT EXISTS campaigns
        (
            id          BIGSERIAL PRIMARY KEY,

            title       VARCHAR(255) NOT NULL,
            description TEXT,
            deleted     BOOLEAN   default false,

            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `

    public static Links = `
        CREATE TABLE IF NOT EXISTS links
        (
            id                   BIGSERIAL PRIMARY KEY,

            dest                 TEXT               NOT NULL,
            description          TEXT NULL, /*for informal redirection*/
            short                VARCHAR(13) UNIQUE NOT NULL, /* aka 63B IDs */
            password             VARCHAR(255) NULL,
            title                VARCHAR(255)       NOT NULL,
            clicks               BIGINT    DEFAULT 0,
            user_id              BIGINT             NOT NULL,
            campaign_id          BIGINT NULL,
            password_protected   BOOLEAN   DEFAULT false,
            expiring_link        BOOLEAN   DEFAULT false,
            informal_redirection BOOLEAN   DEFAULT false,
            monitor              BOOLEAN   DEFAULT false,
            plus_enabled         BOOLEAN   DEFAULT true,

            expiration_date      TIMESTAMP NULL,
            created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (campaign_id) REFERENCES campaigns (id)
        );
    `

    public static Tags = `
        CREATE TABLE IF NOT EXISTS tags
        (
            id         BIGSERIAL PRIMARY KEY,

            name       VARCHAR(255) UNIQUE NOT NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `

    public static TagsLinksPivot = `
        CREATE TABLE IF NOT EXISTS tags_links
        (
            id         BIGSERIAL PRIMARY KEY,
            link_id    BIGINT NOT NULL,
            tag_id     BIGINT NOT NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (link_id) REFERENCES links (id),
            FOREIGN KEY (tag_id) REFERENCES tags (id)
        );
    `

    public static DeviceTargeting = `
        CREATE TABLE IF NOT EXISTS device_targeting
        (
            id           BIGSERIAL PRIMARY KEY,
            link_id      BIGINT,

            device_type  devicetype  default 'other',
            device_brand devicebrand default 'other',

            created_at   TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
            updated_at   TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (link_id) REFERENCES links (id)
        );
    `

    public static GeoTargeting = `
        CREATE TABLE IF NOT EXISTS geo_targeting
        (
            id          BIGSERIAL PRIMARY KEY,
            link_id     BIGINT,

            country_iso VARCHAR(5) NOT NULL,

            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (link_id) REFERENCES links (id)
        );
    `

    public static WebHooks = `
        CREATE TABLE IF NOT EXISTS webhooks
        (
            id              BIGSERIAL PRIMARY KEY,
            link_id         BIGINT,

            destination_url TEXT               NOT NULL,
            secret          TEXT               NOT NULL,
            method          VARCHAR(15)        NOT NULL,
            content_type    webhookcontenttype NOT NULL,
            headers         TEXT,

            created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (link_id) REFERENCES links (id)
        );
    `

    public static Tokens = `
        CREATE TABLE IF NOT EXISTS tokens
        (
            id
                            BIGSERIAL
                PRIMARY
                    KEY,
            user_id
                            BIGINT,

            title
                            VARCHAR(255) NOT NULL,
            token           TEXT UNIQUE  NOT NULL,
            expiration_date TIMESTAMP    NOT NULL,

            created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY
                (
                 user_id
                    ) REFERENCES users
                (
                 id
                    )
        );
    `
}