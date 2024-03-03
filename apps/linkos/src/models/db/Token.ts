import PostgresProvider from "../../providers/PostgresProvider.ts";
import Log from "../../utils/Log.ts";
import crypto from "crypto";

export default class Token {
    public id: string            = '';
    public user_id: number       = 0;
    public title: string         = '';
    public token: string         = '';
    public expiration_date: Date = new Date();

    public created_at: Date = new Date();
    public updated_at: Date = new Date();

    public static async create(user_id: string, title: string, token: string, expiration_date: Date) {
        try {
            const pg = PostgresProvider.getClient();

            const text   = 'INSERT INTO tokens(user_id, title, token,expiration_date) VALUES($1, $2,$3,$4) RETURNING *'
            const values = [user_id, title, token, expiration_date]

            const res = await pg?.query<Token>(text, values);
            if (res) {
                return res.rows[0];
            }
        } catch (e: any) {
            Log.error(e);
        }

        return false;
    }


    public static encrypt(token: string, secret: string): string {
        const cipher  = crypto.createCipheriv('aes-256-cbc', crypto.scryptSync(secret, 'salt', 32), Buffer.alloc(16, 0));
        let encrypted = cipher.update(token, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        return encrypted;
    }

    public static decrypt(encrypted: string, secret: string): string {
        const decipher = crypto.createDecipheriv('aes-256-cbc', crypto.scryptSync(secret, 'salt', 32), Buffer.alloc(16, 0));
        let decrypted  = decipher.update(encrypted, 'base64', 'utf8');

        return (decrypted + decipher.final('utf8'));

    }
}