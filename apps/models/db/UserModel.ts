import BaseDBModel from "./base/BaseDBModel";

declare type UserLevel = 'owner' | 'admin' | 'editor' | 'writer' | 'reader';
export type {UserLevel};

export default class UserModel extends BaseDBModel {
    public email: string    = '';
    public level: UserLevel = 'reader';
    public last_login: Date = new Date();
}