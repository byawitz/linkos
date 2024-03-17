import {DEFAULT_LANG, type SystemLang,} from "../../dashboard/src/locale/I18n";
import BaseDBModel from "./base/BaseDBModel";

declare type UserLevel = 'owner' | 'admin' | 'editor' | 'writer' | 'reader';
export type {UserLevel};

export default class UserModel extends BaseDBModel {
    public isLoggedIn: boolean = false;

    public email: string    = '';
    public fullname: string = '';
    public level: UserLevel = 'reader';

    public lang?: SystemLang;
    public dark_theme: boolean | null = null;

    public last_login: Date = new Date();

    public static fromJSON(json: any): UserModel {
        const user = new UserModel();

        user.id         = json.id ?? 0;
        user.email      = json.email ?? '';
        user.fullname   = json.fullname ?? '';
        user.level      = json.level ?? 'reader';
        user.lang       = json.lang ?? DEFAULT_LANG;
        user.dark_theme = json.dark_theme ?? null;

        user.last_login = json.last_login ?? new Date();
        user.created_at = json.created_at ?? new Date();
        user.updated_at = json.updated_at ?? new Date();

        user.isLoggedIn = true;

        return user;
    }
}