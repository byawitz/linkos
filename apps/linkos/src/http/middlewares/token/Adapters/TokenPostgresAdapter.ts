import Token from "../Models/Token.ts";
import type TokenAdapter from "./TokenAdapter.ts";

export default class TokenPostgresAdapter implements TokenAdapter {
    async initAdapter(): Promise<void> {
        return;
    }

    async addToken(token: Token): Promise<boolean> {
        return true;
    }

    async getToken(token: string): Promise<Token | null> {
        return new Token();
    }

}