import BaseDBModel from "./base/BaseDBModel";

export default class LinkModel extends BaseDBModel {
    public dest: string  = '';
    public short: string = '';
    public title: string = '';
    public password?: string;
    public description?: string;

    public clicks: number       = 0;
    public user_id?: number     = undefined;
    public campaign_id?: number = undefined;

    public monitor?: boolean;
    public plus_enabled?: boolean;
    public expiring_link?: boolean;
    public pass_parameters?: boolean;
    public password_protected?: boolean;
    public informal_redirection?: boolean;

    public expiration_date?: Date;

    // For joins
    public username: string       = '';
    public campaign_title: string = '';

    // For view
    public copying = false;


    public static dbData(link: LinkModel) {
        return {
            id                  : link.id === '' ? undefined : link.id,
            dest                : link.dest,
            short               : link.short,
            title               : link.title,
            password            : link.password,
            description         : link.description,
            clicks              : link.clicks,
            user_id             : link.user_id,
            campaign_id         : link.campaign_id,
            monitor             : link.monitor,
            plus_enabled        : link.plus_enabled,
            expiring_link       : link.expiring_link,
            password_protected  : link.password_protected,
            informal_redirection: link.informal_redirection,
            expiration_date     : link.expiration_date,
        }
    }
}