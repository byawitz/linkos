import UserModel, {type UserLevel} from "@@/db/UserModel.ts";
import Log from "@/utils/Log.ts";
import PostgresProvider from "@/providers/PostgresProvider.ts";


export default class User extends UserModel {

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

    public static async setName(email: string, name: string) {
        try {
            const pg = PostgresProvider.getClient();

            const text   = `UPDATE users
                            SET fullname= $1
                            WHERE email = $2 `
            const values = [name, email]

            const res = await pg?.query<User>(text, values);

            if (res) {
                return res.rows[0];
            }
        } catch (e: any) {
            Log.error(e);
        }

        return false;
    }

    public static async setProfileOptions(email: string, theme: boolean | null, lang: string) {
        try {
            const pg = PostgresProvider.getClient();

            const text   = `UPDATE users
                            SET dark_theme= $1,
                                lang= $2
                            WHERE email = $3`
            const values = [theme, lang, email]

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