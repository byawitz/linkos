export default class Token {
    public token: string;
    private expiration: string;

    constructor(token = '', expiration = '') {
        this.token      = token;
        this.expiration = expiration;
    }

    public get expirationDate(): Date {
        try {
            return new Date(this.expiration);
        } catch (e) {
            return new Date();
        }
    }

    public set expirationDate(date: string) {
        this.expiration = date;
    }

    public toJSON() {
        return {
            'token'     : this.token,
            'expiration': this.expirationDate,
        }
    }
}