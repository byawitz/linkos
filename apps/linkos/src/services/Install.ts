import Log from "../utils/Log.ts";
import KafkaProvider from "../providers/KafkaProvider.ts";
import PostgresProvider from "../providers/PostgresProvider.ts";
import {type QueryResult} from "pg";
import PostgresTables from "../install/PostgresTables.ts";
import ClickHouseTables from "../install/ClickHouseTables.ts";
import ClickhouseProvider from "../providers/ClickhouseProvider.ts";
import inquirer from 'inquirer';
import chalk from "chalk";
import Analytics from "./Analytics.ts";
import WebHooks from "./WebHooks.ts";
import User from "../models/db/User.ts";
import Token from "../models/db/Token.ts";
import Env from "@/utils/Env.ts";


export default class Install {
    public static async init() {
        Log.instructions('Starting Linkos installation process.', '\n⚡️ ');

        await this.setPostgres();
        await this.setClickHouse();
        await this.setKafka();

        const answers = await this.askQuestions();

        const user = await this.createOwnerUser(answers);
        await this.generateToken(user);

    }

    private static async setPostgres() {
        const pg = PostgresProvider.getClient();

        if (pg === null) return;
        Log.info('\n- Creating Postgres tables');

        pg.query(PostgresTables.UsersEnum, this.typeCallback);
        pg.query(PostgresTables.DeviceType, this.typeCallback);
        pg.query(PostgresTables.DeviceBrand, this.typeCallback);
        pg.query(PostgresTables.WebHookContentType, this.typeCallback);

        try {
            await pg.query(PostgresTables.Users);
            await pg.query(PostgresTables.Campaigns);
            await pg.query(PostgresTables.Links);
            await pg.query(PostgresTables.Tags);
            await pg.query(PostgresTables.TagsLinksPivot);
            await pg.query(PostgresTables.DeviceTargeting);
            await pg.query(PostgresTables.GeoTargeting);
            await pg.query(PostgresTables.WebHooks);
            await pg.query(PostgresTables.Tokens);

            Log.good('Created Postgres tables');
        } catch (e: any) {
            Log.error(e, 'Error while setting Postgres tables');
        }
    }

    private static async setClickHouse() {
        const ch = ClickhouseProvider.getClient();
        Log.info('\n- Creating ClickHouse tables');

        try {
            await ch.exec({query: ClickHouseTables.LinkosDatabase});
            await ch.exec({query: ClickHouseTables.WebHooksLogs});
            await ch.exec({query: ClickHouseTables.WebHooksExecutions});
            await ch.exec({query: ClickHouseTables.TokenUsages});
            await ch.exec({query: ClickHouseTables.LinkClicks});
            await ch.exec({query: ClickHouseTables.Monitoring});

            Log.good('Created ClickHouse tables');

        } catch (e: any) {
            Log.error(e);
            console.log(e);
        }
    }

    private static async setKafka(): Promise<void> {
        const kafka = KafkaProvider.getKafka();

        if (kafka === undefined) {
            Log.error('Error running Kafka installation commands.')
            return;
        }
        Log.info('\n- Creating Kafka topic');

        const admin        = kafka.admin();
        const linkosTopics = [Analytics.TOPIC, WebHooks.TOPIC];

        try {

            const topics = await admin.listTopics()

            for (const topic of linkosTopics) {
                if (!topics.includes(topic)) {
                    await admin.createTopics({topics: [{topic, numPartitions: parseInt(Env.KAFKA_NUMBER_OF_PARTITIONS)}]});
                }
            }

            Log.good('Kafka topic successfully created');
        } catch (e) {
            Log.error('Error running Kafka installation commands.')
        }
    }

    private static typeCallback(err: Error, res: QueryResult) {
        if (err && !err.message.includes('already exists')) {
            Log.error(err.message);
        }
    }

    private static async askQuestions() {
        return inquirer.prompt([
            {
                type    : "input",
                name    : "email",
                message : chalk.cyan('Enter appwrite user email for the admin account:'),
                validate: (email: string) => {
                    if (!/^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>().,;\s@"]+\.?)+([^<>().,;:\s@"]{2,}|[\d.]+))$/.test(email)) {
                        console.log('\n');
                        Log.error('This is not a valid email\n');

                        return false;
                    }

                    return true;
                }
            },
        ]);
    }

    private static async createOwnerUser(answers: any) {
        const user = await User.create(answers.email, 'owner')

        if (user) {
            Log.good('Owner user created')
            return user;
        }

        Log.error('Creating owner user', 'Error')
        process.exit(-1);
    }

    private static async generateToken(user: User) {
        const expiration_date = new Date()
        expiration_date.setTime((new Date()).getTime() + (365 * 24 * 60 * 60 * 1000));

        // Todo: generate strong token using nanoid
        const token = Token.encrypt('token', process.env.APP_SSL_KEY ?? '');

        if (await Token.create(user.id, 'Owner Token', token, expiration_date)) {
            Log.good('Owner token created')
            return;
        }

        Log.error('Creating owner token', 'Error')
    }
}