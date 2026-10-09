# dropcowboy (v1 SDK + CLI)

> **This package is for Drop Cowboy's v1 API, which is legacy.** v1 keeps
> working, so existing code doesn't need to change today. New work should use
> the current API at `https://api-v2.dropcowboy.com`: start with the
> [API quickstart](https://www.dropcowboy.com/developers/api/quickstart). There
> is no npm package for the current API; any HTTP client works, and the
> [OpenAPI spec](https://api-v2.dropcowboy.com/openapi.yaml) generates one in
> your language.

This package gives you a TypeScript client and a command line tool for the v1
API at `https://api.dropcowboy.com/v1`. It sends ringless voicemails and texts,
manages contact lists, and lists your brands, recordings, media and number
pools. It works in CommonJS and ESM projects on Node.js 18 and later.

A ringless voicemail delivers your recorded message directly to the contact's
voicemail box.

## Install

```bash
npm install dropcowboy
```

For the command line tool:

```bash
npm install -g dropcowboy
```

## Credentials

v1 uses your **team id** and **secret** from the API settings in the
dashboard. Pass them to the client, or save them once in `~/.dropcowboyrc`:

```json
{
  "teamId": "YOUR_TEAM_ID",
  "secret": "YOUR_SECRET",
  "baseUrl": "https://api.dropcowboy.com/v1"
}
```

`baseUrl` is optional and defaults to `https://api.dropcowboy.com/v1`.

```ts
import { DropCowboy } from 'dropcowboy';

const client = new DropCowboy({
  teamId: 'YOUR_TEAM_ID',
  secret: 'YOUR_SECRET'
});
```

### Sends need the credentials in the payload too

The client sends your credentials as `x-team-id` and `x-secret` headers. The
list, brand, recording, media and pool routes read those headers. **The v1
`/rvm` and `/sms` routes don't**: they only read `team_id` and `secret` from
the JSON body. So add both to every `sendRvm` and `sendSms` payload:

```ts
await client.sendRvm({
  team_id: 'YOUR_TEAM_ID',
  secret: 'YOUR_SECRET',
  brand_id: '00000000-0000-0000-0000-000000000000',
  recording_id: '00000000-0000-0000-0000-000000000000',
  phone_number: '+15555550123'
});
```

Without them, the send still answers `{"status": "queued"}`, and is then
rejected as not authorized, so nothing is sent. The `send-rvm` and `send-sms` commands below
can't add body credentials yet, so use the SDK (or curl) for sends.

## SDK reference

### `sendRvm(payload)`

Sends a ringless voicemail.

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| team_id | string | yes | Your team id. See "Sends need the credentials in the payload too". |
| secret | string | yes | Your secret. |
| brand_id | string | yes | Your brand's id (a UUID), from the trust center. |
| phone_number | string | yes | The contact's number in E.164 format, like `+15555550123`. |
| recording_id | string | one of these | The id (a UUID) of a recording in your account. |
| voice_id + tts_body | string | one of these | A Mimic AI voice id and the text it reads. |
| audio_url + audio_type | string | one of these | A link to an mp3 or wav file, and its type (`mp3` or `wav`). Needs approval from support. |
| forwarding_number | string | optional | Where calls and texts go when the contact replies. |
| phone_ivr_id | string | optional | The IVR used when the contact calls back. |
| pool_id | string | optional | A private number pool. Leave it out to use the shared pool. |
| foreign_id | string | optional | Your own id for this send. It comes back on the callback. |
| callback_url | string | optional | Overrides your account's default webhook URL for this send. |
| privacy | string | optional | Caller id privacy. Defaults to `off`. |
| postal_code | string | optional | The contact's postal code. |
| status_format | string | optional | Only set this if Drop Cowboy support asks you to. |
| byoc | object | optional | Your own SIP trunk and caller id signing details. Ask support. |

Returns a promise of the API's response.

### `sendSms(payload)`

Sends a text.

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| team_id | string | yes | Your team id. |
| secret | string | yes | Your secret. |
| caller_id | string | yes | The number the text comes from, in E.164 format. |
| phone_number | string | yes | The contact's number in E.164 format. |
| pool_id | string | yes | The id of a private number pool that is registered for texting. |
| sms_body | string | yes | The message. Up to 160 characters. |
| opt_in | boolean | yes | `true` confirms the contact agreed to get texts from you. |
| foreign_id | string | optional | Your own id for this send, up to 256 characters. It comes back on the callback. |
| callback_url | string | optional | Overrides your account's default webhook URL for this send. |

```ts
await client.sendSms({
  team_id: 'YOUR_TEAM_ID',
  secret: 'YOUR_SECRET',
  phone_number: '+15555550123',
  caller_id: '+15555550199',
  pool_id: '00000000-0000-0000-0000-000000000000',
  sms_body: 'Hello from my app. Reply STOP to opt out.',
  opt_in: true
});
```

### Contact lists

- `createContactList({ list_name })`
- `getContactList(listId)`
- `renameContactList(listId, { list_name })`
- `deleteContactList(listId)`
- `appendContactsToList(listId, { fields, values })`

```ts
const list = await client.createContactList({ list_name: 'Leads' });
await client.appendContactsToList(list.list_id, {
  fields: ['phone_number', 'first_name'],
  values: [
    ['+15555550123', 'Ana'],
    ['+15555550124', 'Ben']
  ]
});
```

### Lists of your resources

- `listBrands(query?)`
- `listRecordings(query?)`, for example `{ api_allowed: true }`
- `listMedia(query?)`
- `listPools(query?)`

## Command line

```bash
# Save your credentials to ~/.dropcowboyrc
dropcowboy config --team-id=YOUR_TEAM_ID --secret=YOUR_SECRET

# Contact lists
dropcowboy contact-list-create --name="Leads"
dropcowboy contact-list-append --id=LIST_ID --fields=phone_number,first_name --values='[["+15555550123","Ana"],["+15555550124","Ben"]]'
dropcowboy contact-list-get --id=LIST_ID
dropcowboy contact-list-rename --id=LIST_ID --name="New name"
dropcowboy contact-list-delete --id=LIST_ID

# Your resources
dropcowboy brands
dropcowboy recordings --api-allowed=true
dropcowboy pools
```

`send-rvm` and `send-sms` also exist, but see
"Sends need the credentials in the payload too" above. Every command supports
`--help`.

## Errors

Every method throws when credentials are missing or the API answers with an
error.

## Development

```bash
npm install
npm run build
npm test
```

## Moving to the current API

The current API uses an `x-key` and `x-secret` pair from **Developers > API
Keys** in the dashboard, and sends `POST https://api-v2.dropcowboy.com/rvm`
with `to` and `media_id` instead of `phone_number` and `recording_id`. Start
with the [API quickstart](https://www.dropcowboy.com/developers/api/quickstart)
and the [developer hub](https://www.dropcowboy.com/developers). For help,
email support@dropcowboy.com.
