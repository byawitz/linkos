# Linkos

## Fully featured Open-source URL Shortener

### Stack:

| What          | Tech          |
|---------------|---------------|
| Backend       | Bun           |
| Links DB      | PostgreSQL    |
| OLAP DB       | ClickHouse    |
| Message Queue | Kafka + KRaft |
| Cache         | Redis         |
| Frontend      | Vue           |

#### Notes:

- _For SSL use either Nginx & certbot, or any domain-level SSL as Cloudflare._

### Features:

| Feature                 | Description                                                                                                                                                              | Quota / Notes |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| Short links             | Number of links can be created each month                                                                                                                                | Unlimited     |
| Campaign                | Create and manage links by campaigns and get stats for campaign in general                                                                                               | Unlimited     |
| Redirect link           | Changing link destination                                                                                                                                                | Unlimited     |
| Custom URI              | Set your own short link hash                                                                                                                                             | Unlimited     |
| Custom domain           | Set custom domain for your links                                                                                                                                         | Unlimited     |
| Clicks                  | How many time each link can be clicked                                                                                                                                   | Unlimited     |
| QR                      | Generate branded link QR code                                                                                                                                            | Unlimited     |
| Private                 | Private links protected with password                                                                                                                                    | Unlimited     |
| Expiration              | Make link expire in N time                                                                                                                                               | Unlimited     |
| I Redirect              | Redirect with **info** and `Continue` button                                                                                                                             | Unlimited     |
| Plus page               | Behind the link page.                                                                                                                                                    | Unlimited     |
| Webhooks                | Get notified when click, goal oriented<br/>Meaning every X clicks, etc.                                                                                                  | Unlimited     |
| Device targeting        | Target link by device type, brand.                                                                                                                                       | Unlimited     |
| Tags                    | Organize links by tags.                                                                                                                                                  | Unlimited     |
| Users                   | Multiple users.                                                                                                                                                          | Unlimited     |
| Geo targeting           | Geo targeting by [ip-db](https://github.com/sapics/ip-location-db)                                                                                                       | Unlimited     |
| CSV/Bulk                | Short a big list of URLs                                                                                                                                                 | 10,000+       |
| Analytics               | Comprehensive link analytics, look below                                                                                                                                 | 3 Years       |
| Monitor                 | Monitor links like uptime robot                                                                                                                                          | Hourly        |
| UTM Builder & Forwarder | Easy UTM builder and forward the UTM data                                                                                                                                | ✅             |
| Parameter passing       | Pass all other parameters                                                                                                                                                | ✅             |
| API                     | The same API being used by the dashboard but with a Token                                                                                                                | ✅             |
| Backup                  | Easy automate backup to any S3-compatible storage                                                                                                                        | ✅             |
| OAuth2 login            | For now Google, Apple & Facebook                                                                                                                                         | ✅             |
| 2FA                     | Enable 2fa with SMS (Plivo, Twilio) and OTPT                                                                                                                             | ✅             |
| Easy firewalling        | For easy endpoint firewalling all api would be behind `/v1/api` endpoint<br/>And, all management would be behind `admin` endpoint and it's changeable in the `.env` file | ✅             |
| GDPR, CCPA, PECR        | Compliance with GPDT, CCPA and PECR.                                                                                                                                     | ✅             |
| SSO/SAML                | Azure AD, Google Workspace.                                                                                                                                              | Later         |

### Analytics

| Feature  | Description                                                                                                            |
|----------|------------------------------------------------------------------------------------------------------------------------|
| Clicks   | Number of clicks                                                                                                       |
| QR scans | How many times the link was accessed through the QR code<br/>it will work as links with QR code have a `qr` in the URL |
| Country  | Country origin                                                                                                         |
| Device   | Device type, and brand                                                                                                 |
| Referrer | URL referrer                                                                                                           |

### Deploying

| Container  | Description           |
|------------|-----------------------|
| Traefik    | Application Proxy     |
| Postgres   | Clicks DB             |
| ClickHouse | OLAP DB               |
| Redis      | Cache DB              |
| Kafka      | Message Queue         |
| Linkos     | A stateless backend   |
| Static     | Compiled Vue frontend |

As the backend is stateless horizontal scaling is very easy.