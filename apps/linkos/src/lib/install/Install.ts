import Log from "../../utils/Log.ts";
import KafkaService from "../../packages/kafka/KafkaService.ts";
import PostgresService from "../../packages/postgres/PostgresService.ts";
import {type QueryResult} from "pg";
import PostgresTables from "./PostgresTables.ts";
import ClickHouseTables from "./ClickHouseTables.ts";
import ClickhouseService from "../../packages/clickhouse/ClickhouseService.ts";
import inquirer from 'inquirer';
import chalk from "chalk";

/**
 * App command:
 * Linkos --install starting point
 */
export default class Install {
    public static async init() {
        Log.instructions('Starting Linkos installation process.', '\n⚡️ ');

        await this.setPostgres();
        await this.setClickHouse();
        await this.setKafka();

        const answers = await this.askQuestions();

        await this.createOwnerUser(answers);
    }

    private static async setPostgres() {
        const pg = PostgresService.getClient();

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
        const ch = ClickhouseService.getClient();
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
        const kafka = KafkaService.getKafka();

        if (kafka === undefined) {
            Log.error('Error running Kafka installation commands.')
            return;
        }
        Log.info('\n- Creating Kafka topic');

        const admin = kafka.admin();

        try {
            const topics = await admin.listTopics()
            if (!topics.includes(KafkaService.TOPIC)) {
                await admin.createTopics({topics: [{topic: KafkaService.TOPIC}]});
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
                message : chalk.cyan('Enter admin account email:'),
                validate: (email: string) => {
                    if (!/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(email)) {
                        console.log('\n');
                        Log.error('This is not a valid email\n');

                        return false;
                    }

                    return true;
                }
            },
            {
                type    : "input",
                name    : "password",
                message : chalk.cyan('Enter admin password:'),
                validate: (password: string) => {
                    if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(password)) {
                        console.log('\n');
                        Log.error('Password need to have:\n - Minimum 8 characters in length  \n - One small letter \n - One big letter \n - and one number  \n');

                        return false;
                    }

                    return true;
                }
            }
        ]);
    }

    private static async createOwnerUser(answers: any) {
        // TODO
        // Encrypt password using env SSL KEY

    }
}