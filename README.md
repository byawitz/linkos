<div style="text-align: center;padding:30px 0" align="center">

<img src="assets/linkos-full.png" width="100" />

Fully featured Open-source URL Shortener

</div>

## Documentations

<details>
<summary>Installing</summary>
As of now Linkos is still in alpha, that's why the installation instruction is concise

Clone these two files to your server

```shell
curl https://raw.githubusercontent.com/byawitz/linkos/master/docker-compose.yml -o docker-compose.yml
curl https://raw.githubusercontent.com/byawitz/linkos/master/.env.example -o .env
```

Edit the `.env` files and set the values for your `Appwrite.version >= 1.5.0` endpoint, project id and API key.

```ini
APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1"
APPWRITE_PROJECT_ID = "project ID"
APPWRITE_API_KEY = "API key"
```

Run

```shell
docker compose up -d
```

Now you'll need to install Linkos by entering the main container and running the following command

```shell
docker exec -it linkos bash
bun src/index.ts --install
```

You'll be asked to enter email for the admin user; this should be a user that you've created in
your Appwrite project.

Now you can seed the database if you want to have some demo data by running

```shell
docker exec -it linkos bash
bun src/index.ts --databases-seeder
```

</details>
<details>
<summary>Adding a language</summary>

We are welcoming any new language PR! Languages are added to `dashboard` only, the rest as API errors are available only in English.

To add a language to `Linkos`, follow these steps, we'll use `es` for this example.

### 1. Add the new language to the [I18n](./apps/dashboard/src/locale/I18n.ts) file, irrelevant lines were omitted. 
```ts
import es from './languages/es.json';

type SystemLang = 'en' | 'he' | 'es';

const LANG_ES: SystemLang = 'es';

const i18n = createI18n({
  ...  
  messages: {
    ...  
    [LANG_ES]: es
  }
});

const allLanguages = [
  { lang: LANG_ES, title: 'Español' }
];

export { ... LANG_ES, ... };

export default i18n;
```

### 2. Add the new language name to all available locale files.
For example, in the English one.
```json
{
  "English": "English",
  "Español": "Spanish",
  ...
}
```

### 3. Translate to your language.
Copy the `en.json` file to `es.json` and translate all the strings.

### 4. Submit for PR.
</details>