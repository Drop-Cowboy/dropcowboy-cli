# DropCowboy SDK + CLI

The **DropCowboy SDK** provides a TypeScript interface and CLI for interacting with DropCowboy’s API. It supports sending ringless voicemails, SMS, managing contact lists, brands, recordings/media, and pools. Works with both **CommonJS** and **ESM** projects and includes a global configuration option.

---

## Features

- TypeScript SDK with typed methods for all endpoints
- CLI tool for common operations (`dropcowboy config`, `dropcowboy send-rvm`, etc.)
- Global config support via `~/.dropcowboyrc`
- Dual module support: ESM & CommonJS
- Automatic TypeScript typings included

---

## Installation

```bash
npm install dropcowboy
```

For global CLI usage:

```bash
npm install -g dropcowboy
```

---

## Configuration

DropCowboy requires `teamId` and `secret` for authentication. You can configure them **globally** or **per instance**.

### Global Configuration

Create a file at `~/.dropcowboyrc`:

```json
{
  "teamId": "your-team-id",
  "secret": "your-secret",
  "baseUrl": "https://api.dropcowboy.com/v1"
}
```

> `baseUrl` is optional; defaults to `https://api.dropcowboy.com/v1`.

### Per-instance Configuration

```ts
import { DropCowboy } from 'dropcowboy';

const client = new DropCowboy({
  teamId: 'your-team-id',
  secret: 'your-secret'
});
```

---

## SDK Reference

### `sendRvm(payload: { phone_number: string; brand_id: string; recording_id: string; callback_url: string; })`

Sends a ringless voicemail to a phone number.

**Parameters:**

| Name              | Type   | Required    | Description                                                                                                                                         |
| ----------------- | ------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| team_id           | string | yes         | Located on the API Setting tab. Example: <Your Account>                                                                                             |
| secret            | string | yes         | Located on the API Setting tab. Example: <Your Secret>                                                                                              |
| brand_id          | string | yes         | Located in your account's trust center tab. Example: <Your Brand GUID>                                                                              |
| phone_number      | string | yes         | Your contact's phone number in E.164 format. Example: +15552223333                                                                                  |
| audio_url         | string | conditional | A URL to the voicemail audio (mp3 or wav). Requires special approval. Example: https://example.com/yourfile.mp3 |
| audio_type        | string | conditional | File type of audio_url (mp3 or wav). Example: mp3                                                                                                   |
| forwarding_number | string | conditional | Phone number to forward calls/texts when contact replies. Example: +15557778888                                                                     |
| recording_id      | string | conditional | ID of the audio recording. Example: <Your Recording GUID>                                                                                           |
| voice_id          | string | conditional | ID of the Mimic AI™ voice to use. Example: <Your Voice GUID>                                                                                        |
| tts_body          | string | conditional | Text to convert to speech using voice_id. Example: Hey Joe, this is Bob from Brand...                                                               |
| status_format     | string | conditional | Status code mapping for callbacks. Only set if instructed by Drop Cowboy                                                                            |
| byoc              | object | conditional | SIP Trunks and STIR/SHAKEN credentials. Contact support for details                                                                                 |
| foreign_id        | string | optional    | Value to identify this drop in your system. Example: <Your system's ID>                                                                             |
| privacy           | string | optional    | Caller ID privacy settings. Example: off                                                                                                            |
| phone_ivr_id      | string | optional    | IVR to use when contact calls back. Example: <Your IVR GUID>                                                                                        |
| pool_id           | string | optional    | ID of private number pool. Defaults to public shared pool                                                                                           |
| postal_code       | string | optional    | Contact postal code for TCPA compliance. Example: 02101                                                                                             |
| callback_url      | string | optional    | Override default RVM webhook URL. Example: http://example.com                                                                 |

**Returns:** `Promise<object>` — API response.

**Example:**

```ts
await client.sendRvm({
    brand_id: "00000000-0000-0000-0000-000000000000", 
    recording_id: "00000000-0000-0000-0000-000000000000", 
    phone_number: "+15552223333", 
    forwarding_number: "+15557778888", 
    foreign_id: "YOUR_DATABASE_RECORD_ID", 
    callback_url: "https://your.server.com"
});
```

### `sendSms(payload: { phone_number: string; caller_id: string; sms_body: string; pool_id: string; opt_in: boolean; })`

Sends an SMS message.

**Parameters:**

| Name         | Type    | Required | Description                                                                                                                            |
| ------------ | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| team_id      | string  | yes      | Located on the API Setting tab. Example: <Your Account>                                                                                |
| secret       | string  | yes      | Located on the API Setting tab. Example: <Your Secret>                                                                                 |
| caller_id    | string  | yes      | Phone number to forward calls/texts when contact replies. Must be in E.164 format. Example: +15557778888                               |
| phone_number | string  | yes      | Your contact's phone number in E.164 format. Example: +15552223333                                                                     |
| pool_id      | string  | yes      | ID of the private number pool registered to send SMS messages                                                                          |
| sms_body     | string  | yes      | Plain text message. Character limit: 160. Example: Hello World                                                                         |
| opt_in       | boolean | yes      | Confirmation that you obtained OPT-IN permission. Example: true                                                                        |
| foreign_id   | string  | optional | Value to identify this drop in your system. Passed through to webhook callback. Max length 256 characters. Example: <Your system's ID> |
| callback_url | string  | optional | Override default RVM webhook URL. Example: http://example.com                                                    |

**Returns:** `Promise<object>` — API response.

**Example:**

```ts
await client.sendSms({
    phone_number: 15552223333,
    caller_id: 15557778888,
    pool_id: "text",
    sms_body: "Hello world",
    opt_in: true,
    callback_url: "http://example.com",
    foreign_id: "<Your system's ID>"
});
```

### Contact List Methods

- `createContactList(payload: { list_name: string })`
- `getContactList(listId: string)`
- `renameContactList(listId: string, payload: { list_name: string })`
- `deleteContactList(listId: string)`
- `appendContactsToList(listId: string, payload: { fields: Array<string>, values: Array<Array<string>> })`

**Example:**

```ts
const list = await client.createContactList({ list_name: 'Leads' });
await client.appendContactsToList(list.id, {
    fields: ['first_name', 'email'],
    values: [
        ['hunter', 'hunter@email.com'],
        ['john', 'john@email.com']
    ]
});
```

### `listBrands(query?: Record<string, any>)`

Lists brands.

**Example:**

```ts
const brands = await client.listBrands({ api_allowed: true });
```

### `listRecordings(query?: Record<string, any>)`
### `listMedia(query?: Record<string, any>)`
### `listPools(query?: Record<string, any>)`

All accept optional query parameters.

**Example:**

```ts
const recordings = await client.listRecordings({ api_allowed: true });
const pools = await client.listPools();
```

---

## CLI Usage

```bash
# Configure global credentials
dropcowboy config --team-id=<teamId> --secret=<secret>

# Send RVM
dropcowboy send-rvm --brand-id=<brandId> --phone-number=+1234567890 --recording-id=https://example.com/message.mp3

# Send SMS
dropcowboy send-sms --caller-id=<callerId> --phone-number=+1234567890 --pool-id=<poolId> --sms-body="Hello World" --opt-in=true

# Manage contact lists
dropcowboy contact-list-create --name="Leads"
dropcowboy contact-list-append --list-id=<listId> --fields=phone_number,first_name --values='[["+1234567890","John"],["+1987654321","Jane"]]'
dropcowboy contact-list-get --list-id=<listId>
dropcowboy contact-list-rename --list-id=<listId> --name="New Name"
dropcowboy contact-list-delete --list-id=<listId>
```

> All CLI commands support `--help` for usage info.

---

## Error Handling

All SDK methods throw errors if credentials are missing or the API responds with an error.

```ts
try {
    await client.sendRvm({
        brand_id: "00000000-0000-0000-0000-000000000000", 
        recording_id: "00000000-0000-0000-0000-000000000000", 
        phone_number: "+15552223333", 
        forwarding_number: "+15557778888", 
        foreign_id: "YOUR_DATABASE_RECORD_ID", 
        callback_url: "https://your.server.com"
    });
} catch (err) {
    console.error('Error sending RVM:', err);
}
```

---

## Development

### Build the SDK

```bash
npm install
npm run build
```

### Test locally

```bash
npm link
# In another project
npm link dropcowboy
```

---

## Notes

- Compatible with **Node.js 18+**
- Supports both **ESM (`import`)** and **CommonJS (`require`)**
- CLI and SDK share the same codebase for consistency
