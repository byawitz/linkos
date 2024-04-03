import {expect, test, describe, beforeAll} from "bun:test";

const apiEndpoint = 'http://127.0.0.1/v1/api'

interface response {
    success: boolean,
    data: any
}

let generatedLinkId = 0;
let deletingId      = 0;
const short         = 'gh';
describe('Adding links', () => {
    test("Adding link", async () => {
        const res = await fetch(`${apiEndpoint}/links/`, {
            headers: {'x-linkos-token': 'token'},
            method : 'POST',
            body   : JSON.stringify({
                dest                : "https://github.com/",
                description         : "GitHub",
                short               : short,
                password            : false,
                title               : "Testing GitHub link",
                user_id             : "1",
                campaign_id         : null,
                password_protected  : false,
                expiring_link       : false,
                informal_redirection: false,
                monitor             : false,
                plus_enabled        : false,
            },)
        });

        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true)
        generatedLinkId = json.data.id;
    });

    test("Adding link for deleting", async () => {
        const res = await fetch(`${apiEndpoint}/links/`, {
            headers: {'x-linkos-token': 'token'},
            method : 'POST',
            body   : JSON.stringify({
                dest                : "https://github.com/",
                description         : "GitHub",
                short               : `${short}deleting`,
                password            : false,
                title               : "Testing GitHub link",
                user_id             : "1",
                campaign_id         : null,
                password_protected  : false,
                expiring_link       : false,
                informal_redirection: false,
                monitor             : false,
                plus_enabled        : false,
            },)
        });

        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true)
        deletingId = json.data.id;
    });

    test("Adding link with password", async () => {
        const res = await fetch(`${apiEndpoint}/links/`, {
            headers: {'x-linkos-token': 'token'},
            method : 'POST',
            body   : JSON.stringify({
                dest                : "https://github.com/",
                description         : "GitHub",
                short               : `${short}2`,
                password            : '1234',
                title               : "Testing GitHub link with password",
                user_id             : "1",
                campaign_id         : null,
                password_protected  : true,
                expiring_link       : false,
                informal_redirection: false,
                monitor             : false,
                plus_enabled        : false,
            },)
        });

        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true)
    });

    test("Adding link with already passed date", async () => {
        const res = await fetch(`${apiEndpoint}/links/`, {
            headers: {'x-linkos-token': 'token'},
            method : 'POST',
            body   : JSON.stringify({
                dest           : "https://github.com/",
                description    : "GitHub",
                short          : `${short}3`,
                title          : "Testing GitHub link with expiration date",
                user_id        : "1",
                campaign_id    : null,
                expiring_link  : true,
                expiration_date: new Date()
            },)
        });

        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true)
    });

    test("Adding link with plus page and informal redirect", async () => {
        const res = await fetch(`${apiEndpoint}/links/`, {
            headers: {'x-linkos-token': 'token'},
            method : 'POST',
            body   : JSON.stringify({
                dest                : "https://github.com/",
                description         : "This is the description of this link!",
                short               : `${short}4`,
                title               : "Testing GitHub link with plus page and informal redirect",
                user_id             : "1",
                campaign_id         : null,
                informal_redirection: true,
                plus_enabled        : true,

            },)
        });

        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true)
    });
});
describe('Getting links', () => {
    test("Getting link details", async () => {
        const res       = await fetch(`${apiEndpoint}/links/${generatedLinkId}`, {
            headers: {'x-linkos-token': 'token'}
        });
        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
        expect(json.data.dest).toEqual('https://github.com/');
    });

    test("Getting all links", async () => {
        const res       = await fetch(`${apiEndpoint}/links/all/100`, {
            headers: {'x-linkos-token': 'token'}
        });
        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
        expect(json.data.items.length).toBeGreaterThan(10);
    });

    test("Getting link stats", async () => {
        const res       = await fetch(`${apiEndpoint}/links/stat/${generatedLinkId}/30`, {
            headers: {'x-linkos-token': 'token'}
        });
        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
        expect(Object.keys(json.data)).toEqual(["basic", "cities", "countries", "referrers"]);
    });
});
describe('Manipulating links', () => {
    test("Updating link", async () => {
        const res       = await fetch(`${apiEndpoint}/links/${generatedLinkId}`, {
            headers: {'x-linkos-token': 'token'},
            method : 'PATCH',
            body   : JSON.stringify({
                id                  : generatedLinkId,
                dest                : "https://github.com/",
                description         : "GitHub",
                short               : `${short}2aa`,
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
        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
    });

    test("Deleting link", async () => {
        const res       = await fetch(`${apiEndpoint}/links/${deletingId}/${short}deleting`, {
            headers: {'x-linkos-token': 'token'},
            method : 'DELETE',
        });
        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
    });
});

