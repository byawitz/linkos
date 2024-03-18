import BaseDBModel from "./base/BaseDBModel";

export default class GeoTargetingModel extends BaseDBModel {
    public link_id: number     = 0;
    public country_iso: string = '';
}