import {expect, test, describe, beforeAll} from "bun:test";

const apiEndpoint = 'http://localhost:8080/v1/api'

interface response {
    success: boolean,
    data: any
}

describe('Basic endpoints, user not logged in', () => {
    test("Health endpoint", async () => {
        const res  = await fetch(`${apiEndpoint}/health`);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
    });

    test("Guest gets 401", async () => {
        const res  = await fetch(`${apiEndpoint}/whoami`);
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.success).toBe(false);
    });
});

describe('Installing & Seeding', () => {
    test('Installing', async () => {
        const proc = Bun.spawn(["docker", "exec", "-i", "linkos", "bash"], {
            stdin: "pipe",
        });
        proc.stdin!.write(`bun /usr/server/app/src/index.ts -i\n`);
        proc.stdin!.write(`test@email.com\n`);
        proc.stdin!.flush();

        const output = await new Response(proc.stdout).text();
        expect(output).toContain('Owner token created')
    });

    test('Seeding', async () => {
        const proc = Bun.spawn(["docker", "exec", "-i", "linkos", "bash"], {
            stdin: "pipe",
        });

        proc.stdin!.write(`bun /usr/server/app/src/index.ts -dbs\n`);
        proc.stdin!.flush();
        proc.stdin!.end();

        const output = await new Response(proc.stdout).text();
        expect(output).toContain('Finished seeding')
    }, 80000);
});

describe('All endpoints logged in', () => {
    let generatedLinkId = 0;

    test("Get user details with token", async () => {
        const res  = await fetch(`${apiEndpoint}/whoami`, {
            headers: {'x-linkos-token': 'token'}
        });
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
    });

    test("Adding link", async () => {
        const res = await fetch(`${apiEndpoint}/links/`, {
            headers: {'x-linkos-token': 'token'},
            method : 'POST',
            body   : JSON.stringify({
                dest                : "https://github.com/",
                description         : "GitHub",
                short               : "gh",
                password            : false,
                title               : "Testing GitHub link",
                user_id             : "1",
                campaign_id         : null,
                password_protected  : false,
                expiring_link       : false,
                informal_redirection: false,
                monitor             : false,
                plus_enabled        : false,
                deleted             : false,
            },)
        });

        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true)
        generatedLinkId = json.data.id;
    });

    test("Getting link details", async () => {
        const res  = await fetch(`${apiEndpoint}/links/${generatedLinkId}`, {
            headers: {'x-linkos-token': 'token'}
        });
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
        expect(json.data.dest).toEqual('https://github.com/');
    });

    test("Getting all links", async () => {
        const res  = await fetch(`${apiEndpoint}/links/`, {
            headers: {'x-linkos-token': 'token'}
        });
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
        expect(json.data.length).toBeGreaterThan(99);
    });

    test("Getting link stats", async () => {
        const res  = await fetch(`${apiEndpoint}/links/stat/1/30`, {
            headers: {'x-linkos-token': 'token'}
        });
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
        expect(Object.keys(json.data)).toEqual(["basic", "cities", "countries", "referrers"]);
    });

    test("Updating link", async () => {
        const res  = await fetch(`${apiEndpoint}/links/1`, {
            headers: {'x-linkos-token': 'token'},
            method : 'PATCH',
            body   : JSON.stringify({
                id                  : 1,
                dest                : "https://github.com/",
                description         : "GitHub",
                short               : "gh2",
                password            : false,
                title               : "Testing GitHub link",
                user_id             : "1",
                campaign_id         : null,
                password_protected  : false,
                expiring_link       : false,
                informal_redirection: false,
                monitor             : false,
                plus_enabled        : false,
                expiration_date     : null,
                updated_at          : new Date(),
            })
        });
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
    });

    test("Deleting link", async () => {
        const res  = await fetch(`${apiEndpoint}/links/1`, {
            headers: {'x-linkos-token': 'token'},
            method : 'DELETE',
        });
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
    });
});