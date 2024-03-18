import BaseDBModel from "./base/BaseDBModel";

type WebHookContentType = 'json' | 'form';

export default class WebHooksModel extends BaseDBModel {
    public link_id: number = 0;

    public destination_url: string          = '';
    public secret: string                   = '';
    public content_type: WebHookContentType = 'json';
    public headers: string                  = '';
    public method: string                   = '';

}