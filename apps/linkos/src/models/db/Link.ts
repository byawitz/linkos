import PostgresProvider from "../../providers/PostgresProvider.ts";
import Log from "../../utils/Log.ts";

export default class Link {
    public id: string    = '';
    public dest: string  = '';
    public short: string = '';
    public description?: string;
    public password?: string;
    public title?: string;

    public user_id?: number;
    public campaign_id?: number;

    public password_protected?: boolean;
    public expiring_link?: boolean;
    public informal_redirection?: boolean;
    public monitor?: boolean;
    public plus_enabled?: boolean;

    public expiration_date?: Date;
    public created_at: Date = new Date();
    public updated_at: Date = new Date();

    public static async create(link: Link) {
        try {
            const pg = PostgresProvider.getClient();

            const text   = 'INSERT INTO links(id, dest, description, short, password, title, user_id, campaign_id, password_protected, expiring_link, informal_redirection, monitor, plus_enabled, expiration_date) ' +
                'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *'
            const values = [link.id, link.dest, link.description, link.short, link.password, link.title, link.user_id, link.campaign_id, link.password_protected, link.expiring_link, link.informal_redirection, link.informal_redirection, link.plus_enabled, link.expiration_date]

            const res = await pg?.query<Link>(text, values);

            if (res) {
                return res.rows[0];
            }
        } catch (e: any) {
            Log.error(e);
        }

        return false;
    }

    public static async getLink(id: string) {
        try {
            const pg = PostgresProvider.getClient();

            // TODO: join user and campaign
            const text   = 'SELECT * FROM links WHERE id=$1';
            const values = [id]

            const res = await pg?.query<Link>(text, values);
            if (res) {
                return res.rows[0];
            }
        } catch (e: any) {
            Log.error(e);
        }

        return false;

    }

    static async getAll() {
        try {
            const pg = PostgresProvider.getClient();

            // TODO: join user and campaign
            const res = await pg?.query<Link>('SELECT * FROM links ORDER BY id');
            if (res) {
                return res.rows;
            }
        } catch (e: any) {
            Log.error(e);
        }

        return false;
    }
}