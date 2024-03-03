import type TokenAdapter from "../Adapters/TokenAdapter.ts";
import TokenLocalAdapter from "../Adapters/TokenLocalAdapter.ts";

export default class TokenOptions {
    public headerName: string    = '';
    public adapter: TokenAdapter = new TokenLocalAdapter();
}