import {expect, test, describe, beforeAll, afterAll} from "bun:test";
import Token from "../../src/middlewares/token/Models/Token.ts";
import TokenPostgresAdapter from "../../src/middlewares/token/Adapters/TokenPostgresAdapter.ts";

const adapter = new TokenPostgresAdapter();

const randomToken        = 'A..Z';
const randomTokenExpired = 'A..ZNExpired';
const weekFromNow        = new Date()
weekFromNow.setTime((new Date()).getTime() + (7 * 24 * 60 * 60 * 1000));

describe.skip('Checking Postgres Token Adapter', () => {
    beforeAll(async () => {
        await adapter.initAdapter();
        // connect to database.
    });

    test("Creating token in Database", async () => {

        expect(false).toBeTrue();
    });

    test('Adding non-expired token', async () => {
        const token = new Token(randomToken, weekFromNow.toISOString());

        await adapter.addToken(token);
        const storedToken = await adapter.getToken(randomToken);

        expect(storedToken?.token).toBe(randomToken);
    });

    test('Adding expired token', async () => {
        const token = new Token(randomTokenExpired, new Date().toISOString());

        await adapter.addToken(token);
        const storedToken = await adapter.getToken(randomTokenExpired);

        expect(storedToken?.token).toBe(randomTokenExpired);
    });

    test('Token is not expired', async () => {
        const storedToken = await adapter.getToken(randomToken);

        expect(storedToken?.expirationDate.getTime()).toBeGreaterThan(new Date().getTime());
    });

    test('Token is expired', async () => {
        const storedToken = await adapter.getToken(randomTokenExpired);

        expect(storedToken?.expirationDate.getTime()).toBeLessThanOrEqual(new Date().getTime());
    });

    afterAll(() => {
        // Disconnect from Database.
    });
})