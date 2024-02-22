import Token from "../Models/Token.ts";
import type TokenAdapter from "./TokenAdapter.ts";
import Log from "../../../utils/Log.ts";

/**
 * Manage your token locally.
 * Meant to be used mostly in dev environments.
 */
export default class TokenLocalAdapter implements TokenAdapter {
    private readonly fileLocation: string = './files/sessions.json';
    private readonly baseFileJSON: string = '{"tokens":{}}';

    constructor(fileLocation = '') {
        if (fileLocation !== '') {
            this.fileLocation = fileLocation;
        }
    }

    async initAdapter(): Promise<void> {
        await this.createFileIfNotExist();
    }

    async getToken(token: string): Promise<Token | null> {
        try {
            const file = Bun.file(this.fileLocation);

            const store = await file.json();

            if (store.tokens[token] !== undefined) {
                return new Token(store.tokens[token].token, store.tokens[token].expiration);
            }
        } catch (e: any) {
            Log.error(e, TokenLocalAdapter.name);
        }

        return null;
    }

    async addToken(newToken: Token): Promise<boolean> {
        try {
            const file = Bun.file(this.fileLocation);

            const store = await file.json();

            if (store.tokens[newToken.token] !== undefined) {
                return false;
            }
            store.tokens[newToken.token] = newToken.toJSON();

            await Bun.write(this.fileLocation, JSON.stringify(store));
        } catch (e: any) {
            Log.error(e.toString());

            return false;
        }


        return true;
    }

    private async createFileIfNotExist() {
        const file = Bun.file(this.fileLocation);
        if (!await file.exists()) {
            await Bun.write(this.fileLocation, this.baseFileJSON);
        }
    }
}