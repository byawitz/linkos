import Link from "@/models/db/Link.ts";

export default class AnalyticsMessage {
    public readonly linkId: string;
    public readonly qr: boolean;
    public readonly referer: string;
    public readonly userAgent: string;
    public readonly ip: string;
    public readonly host: string;

    constructor(linkId: string, qr: boolean = false, headers: Record<string, string>) {

        this.linkId    = linkId;
        this.qr        = qr;
        this.referer   = headers ['referer'] ?? '';
        this.userAgent = headers ['user-agent'] ?? '';
        this.ip        = headers ['x-forwarded-for'] ?? '';
        this.host      = headers ['host'] ?? '';
    }


    public toString(): string {
        return JSON.stringify({
            linkId   : this.linkId,
            qr       : this.qr,
            referer  : this.referer,
            userAgent: this.userAgent,
            ip       : this.ip,
            host     : this.host,
        });
    }

    public static toJSON(json: string): AnalyticsMessage {
        const parsed = JSON.parse(json);
        return new AnalyticsMessage(parsed.linkId, parsed.qr ?? false, parsed.referer, parsed.userAgent, parsed.ip, parsed.host);
    }
}