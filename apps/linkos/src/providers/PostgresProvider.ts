import {Client} from 'pg';
import Log from "../utils/Log.ts";
import knex from 'knex';
import Global from "@/utils/Global.ts";
import type {Knex} from "knex";

export default class PostgresProvider {
    private static client?: Client;
    private static pg?: Knex;

    public static async init() {
        if (PostgresProvider.client) return;

        try {
            PostgresProvider.pg     = knex({
                client    : 'pg',
                connection: {
                    host    : process.env.POSTGRES_HOST,
                    port    : Global.ParseOrValue(process.env.POSTGRES_PORT, 5432),
                    user    : process.env.POSTGRES_USER,
                    database: process.env.POSTGRES_DB,
                    password: process.env.POSTGRES_PASSWORD,
                    ssl     : false,
                },
            });
            PostgresProvider.client = new Client({
                host    : process.env.POSTGRES_HOST,
                database: process.env.POSTGRES_DB,
                user    : process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
            })

            await PostgresProvider.client.connect()

            Log.good('Successfully connected to Postgres');

            process.on("SIGINT", async () => {
                if (PostgresProvider.client !== undefined)
                    await PostgresProvider.client.end();
            });
        } catch (e: any) {
            Log.error(e.message, 'Error connecting to Postgres:');
            process.exit(-1);
        }
    }

    public static getClient(): Client | null {
        if (!PostgresProvider.client) {
            Log.error('Postgres client is not available')
            return null
        }
        return PostgresProvider.client;
    }

    public static get getPgClient(): Knex {
        if (!PostgresProvider.pg) {
            Log.error('Postgres client is not available')
            throw '';
        }

        return PostgresProvider.pg;
    }
}