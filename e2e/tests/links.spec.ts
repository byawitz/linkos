import {expect, test, describe, beforeAll} from "bun:test";

const endpoint = 'http://traefik:8080/'

interface response {
    success: boolean,
    data: any
}

describe('Redirection', () => {
    test("Link being redirected", async () => {
        const res  = await fetch(`${endpoint}/gh`);

        expect(res.status).toBe(200);
        expect(res.url).toEqual('https://github.com/');
    });

});
