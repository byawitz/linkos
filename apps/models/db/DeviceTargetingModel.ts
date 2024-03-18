import BaseDBModel from "./base/BaseDBModel";

type DeviceTargetingType = 'desktop' | 'mobile' | 'other';
type DeviceTargetingBrand = 'apple' | 'android' | 'other';

export default class DeviceTargetingModel extends BaseDBModel {
    public link_id: number = 0;

    public device_type: DeviceTargetingType   = 'other';
    public device_brand: DeviceTargetingBrand = 'other';

}