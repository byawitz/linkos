import BaseDBModel from "./base/BaseDBModel";

export default class LinkModel extends BaseDBModel {
    public dest: string  = '';
    public short: string = '';
    public title: string = '';
    public password?: string;
    public description?: string;

    public clicks: number = 0;
    public user_id?: number;
    public campaign_id?: number;

    public monitor?: boolean;
    public plus_enabled?: boolean;
    public expiring_link?: boolean;
    public password_protected?: boolean;
    public informal_redirection?: boolean;

    public expiration_date?: Date;

    // For joins
    public username: string       = '';
    public campaign_title: string = '';

    // For view
    public copying = false;
}