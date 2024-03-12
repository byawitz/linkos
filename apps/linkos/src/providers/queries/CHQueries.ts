export default class CHQueries {
    static deleteForLinkID: string = `DELETE
                                      FROM linkos.links_clicks
                                      WHERE link_id = {id: Int64}`;

    public static getTopGroup(what: string) {
        return `SELECT ${what}, count(*) as total
                FROM linkos.links_clicks
                WHERE link_id = {id: Int64}
                  AND timestamp >= now() - INTERVAL {days : Int32} DAY
                group by ${what}
                ORDER BY total DESC
                LIMIT 10;`;
    }

    public static getLinkClickAndDevices() {
        return `SELECT count(*)                                                                                                                      AS clicks,
                       sum(is_qr = false)                                                                                                            AS direct,
                       sum(is_qr)                                                                                                                    AS qr,
                       sum(device_type ILIKE 'mobile' AND isNotNull(device_type))                                                                    AS mobile,
                       sum(device_type NOT ILIKE 'mobile' AND isNotNull(device_type))                                                                AS unknown_type,
                       sum(isNull (device_type))                                                                                                     AS desktop,
                       sum(device_brand ILIKE 'apple' AND isNotNull(device_brand))                                                                   AS apple,
                       sum(device_brand ILIKE 'android' AND isNotNull(device_brand))                                                                 AS android,
                       sum(isNull (device_brand) OR (links_clicks.device_brand NOT ILIKE 'apple' AND links_clicks.device_brand NOT ILIKE 'android')) AS unknown_brand,
                       toMonth(timestamp)                                                                                                            AS month,
                       toDayOfMonth(timestamp)                                                                                                       AS day
                FROM linkos.links_clicks
                WHERE link_id = {id: Int64}
                  AND timestamp >= now() - INTERVAL {days : Int32} DAY
                GROUP BY month, day
                ORDER BY day, month;`
    }
}