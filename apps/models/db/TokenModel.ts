import BaseDBModel from "./base/BaseDBModel";

export default class TokenModel extends BaseDBModel {
    public user_id: number       = 0;
    public title: string         = '';
    public token: string         = '';
    public expiration_date: Date = new Date();
}