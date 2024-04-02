import {expect, test, describe, beforeAll} from "bun:test";

const apiEndpoint = 'http://127.0.0.1/v1/api'

interface response {
    success: boolean,
    data: any
}

let generatedCampaignID = 0;
const title             = "First Campaign";
describe('Testing Campaigns', () => {
    test("Adding Campaign", async () => {
        const res = await fetch(`${apiEndpoint}/campaigns/`, {
            headers: {'x-linkos-token': 'token'},
            method : 'POST',
            body   : JSON.stringify({
                title,
                description: "Campaign for testing!",
            }),
        });

        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true)
        generatedCampaignID = json.data.id;
    });

    test("Adding Second Campaign", async () => {
        const res = await fetch(`${apiEndpoint}/campaigns/`, {
            headers: {'x-linkos-token': 'token'},
            method : 'POST',
            body   : JSON.stringify({
                title      : `${title} Duplicate`,
                description: "Campaign for testing!",
            })
        });

        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true)
    });

    test("Getting Campaign", async () => {
        const res       = await fetch(`${apiEndpoint}/campaigns/${generatedCampaignID}`, {
            headers: {'x-linkos-token': 'token'}
        });
        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
        expect(json.data.id).toEqual(generatedCampaignID);
        expect(json.data.title).toEqual(title);
    });

    test("Getting all Campaigns", async () => {
        const res       = await fetch(`${apiEndpoint}/campaigns/all/100`, {
            headers: {'x-linkos-token': 'token'}
        });
        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
        expect(json.data.items.length).toBeGreaterThan(1);
    });

    test("Updating Campaign", async () => {
        const res       = await fetch(`${apiEndpoint}/campaigns/${generatedCampaignID}`, {
            headers: {'x-linkos-token': 'token'},
            method : 'PATCH',
            body   : JSON.stringify({
                id: generatedCampaignID,
                description: "Campaign for testing!!!",
            })
        });
        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
        expect(json.data.description).toContain('!!!');
    });

    test("Deleting Campaign", async () => {
        const res       = await fetch(`${apiEndpoint}/campaigns/${generatedCampaignID}`, {
            headers: {'x-linkos-token': 'token'},
            method : 'DELETE',
        });
        const json: any = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
    });

    test("Deleted Campaign fetching should return 404", async () => {
        const res       = await fetch(`${apiEndpoint}/campaigns/${generatedCampaignID}`, {
            headers: {'x-linkos-token': 'token'},
        });
        const json: any = await res.json();

        expect(res.status).toBe(404);
        expect(json.success).toBe(false);
    });
});