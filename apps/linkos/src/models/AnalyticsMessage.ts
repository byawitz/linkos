import Link from "@/models/db/Link.ts";

export default class AnalyticsMessage {
    public readonly link: Link;
    public readonly qr: boolean;
    public readonly referer: string;
    public readonly userAgent: string;
    public readonly ip: string;
    public readonly host: string;

    constructor(link: Link | false, qr: boolean = false, referer?: string, userAgent?: string, ip?: string, host?: string) {
        this.link      = link !== false ? link : new Link();
        this.qr        = qr;
        this.referer   = referer ?? '';
        this.userAgent = userAgent ?? '';
        this.ip        = ip ?? '';
        this.host      = host ?? '';
    }


    public toString(): string {
        return JSON.stringify({
            link     : this.link,
            qr       : this.qr,
            referer  : this.referer,
            userAgent: this.userAgent,
            ip       : this.ip,
            host     : this.host,
        });
    }

    public static toJSON(json: string): AnalyticsMessage {
        const parsed     = JSON.parse(json);
        const parsedLink = parsed.link ?? new Link();

        const link = new Link();

        link.id                   = parsedLink.id;
        link.dest                 = parsedLink.dest;
        link.short                = parsedLink.short;
        link.title                = parsedLink.title;
        link.password             = parsedLink.password;
        link.description          = parsedLink.description;
        link.user_id              = parsedLink.user_id;
        link.campaign_id          = parsedLink.campaign_id;
        link.monitor              = parsedLink.monitor;
        link.plus_enabled         = parsedLink.plus_enabled;
        link.expiring_link        = parsedLink.expiring_link;
        link.password_protected   = parsedLink.password_protected;
        link.informal_redirection = parsedLink.informal_redirection;
        link.expiration_date      = parsedLink.expiration_date;
        link.created_at           = parsedLink.created_at;
        link.updated_at           = parsedLink.updated_at;

        return new AnalyticsMessage(link, parsed.qr ?? false, parsed.referer, parsed.userAgent, parsed.ip, parsed.host)
    }
}