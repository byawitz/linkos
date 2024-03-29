import PostgresProvider from "@/providers/PostgresProvider.ts";

export default class P {
    public static get db() {
        return PostgresProvider.getPgClient;
    }
}