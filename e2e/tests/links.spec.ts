import {expect, test, describe, beforeAll} from "bun:test";

const endpoint = 'http://127.0.0.1/'

interface response {
    success: boolean,
    data: any
}

describe('Redirection', () => {
    test("Link being redirected", async () => {
        const res = await fetch(`${endpoint}/gh`);

        expect(res.status).toBe(200);
        expect(res.url).toEqual('https://github.com/');
    });

    test("Link should return 404", async () => {
        const res = await fetch(`${endpoint}/gh3`);

        expect(res.status).toBe(404);
    });

    test("Link should informal redirect", async () => {
        const res = await fetch(`${endpoint}/gh4`);

        expect(res.status).toBe(200);
        const text = await res.text();

        expect(text.includes('Testing GitHub link with plus page and informal redirect')).toBe(true);
    });

    test("Link should have Plus page", async () => {
        const res = await fetch(`${endpoint}/gh4+`);

        expect(res.status).toBe(200);
        const text = await res.text();

        expect(text.includes('Link destination')).toBe(true);
    });

    test("Link should be protected with password", async () => {
        const res = await fetch(`${endpoint}/gh2`);

        expect(res.status).toBe(200);
        const text = await res.text();

        expect(text.includes('Testing GitHub link with password')).toBe(true);
        expect(text.includes('Password is required to access this short link destination')).toBe(true);
    });

    test("Link should redirect with correct password", async () => {
        const formData = new FormData();

        formData.set('password', '1234');

        const res = await fetch(`${endpoint}/password/gh2`, {
            method: 'POST',
            body  : formData,
        });

        expect(res.status).toBe(200);
        expect(res.url).toEqual('https://github.com/');
    });
});
