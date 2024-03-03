import type Token from "../Models/Token.ts";

export default interface TokenAdapter {
    initAdapter(): Promise<void>;

    getToken(token: string): Promise<Token | null>;

    addToken(token: Token): Promise<boolean>;
}