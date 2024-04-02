import {expect, test, describe, beforeAll} from "bun:test";

const apiEndpoint = 'http://127.0.0.1/v1/api'

interface response {
    success: boolean,
    data: any
}

describe('Basic endpoints, user not logged in', () => {
    test("Health endpoint", async () => {
        const res       = await fetch(`${apiEndpoint}/health`);
        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
    });

    test("Guest gets 401", async () => {
        const res       = await fetch(`${apiEndpoint}/whoami`);
        const json: any = await res.json();

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
        proc.stdin!.end();

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

describe('Checking logged-in', () => {
    test("Get user details with token", async () => {
        const res       = await fetch(`${apiEndpoint}/whoami`, {
            headers: {'x-linkos-token': 'token'}
        });
        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
    });
});
