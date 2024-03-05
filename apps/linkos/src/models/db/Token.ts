import PostgresProvider from "../../providers/PostgresProvider.ts";
import Log from "../../utils/Log.ts";
import crypto from "crypto";
import type User from "./User.ts";
import TokenModel from "@@/db/TokenModel.ts";

export default class Token extends TokenModel {


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

    public static async getUser(encrypted: string): Promise<User | undefined> {
        try {
            const pg = PostgresProvider.getClient();

            const text   = `SELECT users.*
                            FROM users
                                     LEFT JOIN tokens ON tokens.user_id = users.id
                            WHERE tokens.token = $1;`
            const values = [encrypted]

            const res = await pg?.query<any>(text, values);
            if (res) {
                return res.rows[0];
            }
        } catch (e: any) {
            Log.error(e, 'ERROR');
        }

        return undefined;
    }
}