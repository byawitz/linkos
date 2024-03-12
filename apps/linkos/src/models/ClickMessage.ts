export default class ClickMessage {
    public readonly linkId: string;

    constructor(linkId: string) {
        this.linkId = linkId;
    }

    public toString(): string {
        return JSON.stringify({linkId: this.linkId,});
    }

    public static toJSON(json: string): ClickMessage {
        const parsed = JSON.parse(json);
        return new ClickMessage(parsed.linkId);
    }
}