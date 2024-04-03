import {expect, test, describe, beforeAll} from "bun:test";

const apiEndpoint = 'http://127.0.0.1/v1/api'

interface response {
    success: boolean,
    data: any
}

let generatedUserID = 0;
const fullname      = "Test User";
describe('Testing Users', () => {
    test("Adding User", async () => {
        const res = await fetch(`${apiEndpoint}/users/`, {
            headers: {'x-linkos-token': 'token'},
            method : 'POST',
            body   : JSON.stringify({
                email     : 'test@test.com',
                fullname,
                lang      : 'en',
                level     : 'owner',
                dark_theme: true,
                last_login: new Date(),
            }),
        });

        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true)
        generatedUserID = json.data.id;
    });

    test("Adding Second User", async () => {
        const res = await fetch(`${apiEndpoint}/users/`, {
            headers: {'x-linkos-token': 'token'},
            method : 'POST',
            body   : JSON.stringify({
                email     : 'test2@test.com',
                fullname  : `${fullname} Duplicate`,
                lang      : 'en',
                level     : 'owner',
                dark_theme: true,
                last_login: new Date(),
            }),
        });


        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true)
    });

    test("Getting User", async () => {
        const res       = await fetch(`${apiEndpoint}/users/${generatedUserID}`, {
            headers: {'x-linkos-token': 'token'}
        });
        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
        expect(json.data.id).toEqual(generatedUserID);
        expect(json.data.fullname).toEqual(fullname);
    });

    test("Getting all Users", async () => {
        const res       = await fetch(`${apiEndpoint}/users/all/100`, {
            headers: {'x-linkos-token': 'token'}
        });
        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
        expect(json.data.items.length).toBeGreaterThan(1);
    });

    test("Updating User", async () => {
        const res       = await fetch(`${apiEndpoint}/users/${generatedUserID}`, {
            headers: {'x-linkos-token': 'token'},
            method : 'PATCH',
            body   : JSON.stringify({
                id         : generatedUserID,
                fullname: "No more mister nice guy",
            })
        });
        const json: any = await res.json();
        console.log(json.data);
        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
        expect(json.data.fullname).toContain('mister');
    });

    test("Deleting User", async () => {
        const res       = await fetch(`${apiEndpoint}/users/${generatedUserID}`, {
            headers: {'x-linkos-token': 'token'},
            method : 'DELETE',
        });
        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
    });


    test("Deleted User fetching should return 404", async () => {
        const res       = await fetch(`${apiEndpoint}/users/${generatedUserID}`, {
            headers: {'x-linkos-token': 'token'},
        });
        const json: any = await res.json();

        expect(res.status).toBe(404);
        expect(json.success).toBe(false);
    });
});