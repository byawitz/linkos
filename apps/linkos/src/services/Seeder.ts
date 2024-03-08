import Log from "../utils/Log.ts";
import PostgresProvider from "@/providers/PostgresProvider.ts";
import ClickhouseProvider from "@/providers/ClickhouseProvider.ts";


const countries = ['Italy', 'Germany', 'Morocco', 'Lebanon', 'Canada'];
const sites     = ['twitter.com', 'facebook.com', 'www.google.com', '', 'facebook.com'];
const cities    = ['London', 'Los Angels', 'New York', 'New York', 'Jerusalem'];

export default class Seeder {
    public static async init() {
        Log.instructions('Seeding your databases...');


        // await Seeder.seedPostgres();
        await Seeder.seedClickHouse();
        Log.good('Finished seeding');

        process.exit(0);
    }

    private static async seedClickHouse() {
        try {
            const ch = ClickhouseProvider.getClient();

            let values = [];
            for (let i = 1; i < 1_000_000_000; i++) {
                values.push({
                    link_id     : Seeder.getRandomArbitrary(1, 100),
                    is_qr       : Seeder.getRandomArbitrary(1, 3) == 1,
                    is_i        : Seeder.getRandomArbitrary(1, 3) == 1,
                    is_plus_view: Seeder.getRandomArbitrary(1, 3) == 1,//TODO
                    domain      : '',
                    country     : countries.sort(() => 0.5 - Math.random())[0],
                    referer     : sites.sort(() => 0.5 - Math.random())[0],
                    timestamp   : (new Date(new Date() - Math.random() * (84600 * 90 * 1000))).toISOString().slice(0, -5),
                    city        : cities.sort(() => 0.5 - Math.random())[0],
                    device_type : Seeder.getRandomArbitrary(1, 3) == 1 ? 'desktop' : 'mobile',
                    device_brand: Seeder.getRandomArbitrary(1, 3) == 1 ? 'apple' : 'android',
                });

                if (i % 100000 === 0) {
                    console.log('Starting inserting 100K Rows');
                    const start = +(new Date())
                    await ch.insert({
                        table : 'linkos.links_clicks',
                        format: "JSONEachRow",
                        values: values,
                    });
                    console.log(`Done 100K rows in ${(+new Date()) - start}ms`);
                    values = [];
                }
            }


        } catch (e) {
            Log.error('Error in Clickhouse seeder');
            console.log(e);
        }

    }

    private static async seedPostgres() {
        try {
            const pg = PostgresProvider.getClient();

            const date = (new Date()).toISOString().slice(0, -5);
            let data   = '';

            for (let i = 1; i < 101; i++) {

                data += `('http://localhost/', 'Link description', '${i}', '${i}', 'Link ${i} title', '1', null, false, false, false, false, false, '${date}'), `;
                if (i % 100 === 0) {
                    const query = 'INSERT INTO links( dest, description, short, password, title, user_id, campaign_id, password_protected, expiring_link, informal_redirection, monitor, plus_enabled, expiration_date) ' +
                        `VALUES
                    ${data}
                   ('http://localhost/', 'Link description', 'i-${i}', '${i}', 'Link ${i} title', '1', null, false, false, false, false, false, '${date}') RETURNING *`;
                    const d     = await pg!.query(query);
                    data        = '';
                    console.log('Inserted 10K rows');
                }
            }


        } catch (e) {
            Log.error('Error in Postgres seeder');
            console.log(e);
        }

    }

    public static getRandomArbitrary(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}