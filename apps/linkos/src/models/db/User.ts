import PostgresProvider from "../../providers/PostgresProvider.ts";
import Log from "../../utils/Log.ts";

declare type UserLevel = 'owner' | 'admin' | 'editor' | 'writer' | 'reader';
export type {UserLevel};

export default class User {
    public id: string       = '';
    public email: string    = '';
    public level: UserLevel = 'reader';
    public created_at: Date = new Date();
    public updated_at: Date = new Date();
    public last_login: Date = new Date();

    public static async create(email: string, level: UserLevel = 'reader') {
        try {
            const pg = PostgresProvider.getClient();

            const text   = 'INSERT INTO users(email, level) VALUES($1, $2) RETURNING *'
            const values = [email, level]

            const res = await pg?.query<User>(text, values);

            if (res) {
                return res.rows[0];
            }
        } catch (e: any) {
            Log.error(e);
        }

        return false;
    }
}