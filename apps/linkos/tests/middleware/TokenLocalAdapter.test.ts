import {expect, test, describe, beforeAll, afterAll} from "bun:test";
import {unlinkSync} from "node:fs";
import TokenLocalAdapter from "../../src/middlewares/token/Adapters/TokenLocalAdapter.ts";
import Token from "../../src/middlewares/token/Models/Token.ts";

const fileLocation       = './tokens.json';
const adapter            = new TokenLocalAdapter(fileLocation);
const randomToken        = 'A..Z';
const randomTokenExpired = 'A..ZNExpired';
const weekFromNow        = new Date()
weekFromNow.setTime((new Date()).getTime() + (7 * 24 * 60 * 60 * 1000));

describe('Checking local Token Adapter', () => {
    beforeAll(async () => {
        await adapter.initAdapter();
    })
    test("Token creating local file file", async () => {
        const exists = await Bun.file(fileLocation).exists();

        expect(exists).toBeTrue();
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
        unlinkSync(fileLocation);
    });
})