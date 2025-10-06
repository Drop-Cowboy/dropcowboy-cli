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
import DropCowboy from 'dropcowboy';

const client = new DropCowboy({
  teamId: 'your-team-id',
  secret: 'your-secret'
});
```

---

## SDK Reference

### `sendRvm(payload: { phone: string; messageUrl: string })`

Sends a ringless voicemail to a phone number.

**Parameters:**

| Name       | Type   | Required | Description                 |
|------------|--------|---------|-----------------------------|
| payload    | object | yes     | Payload containing message details |
| phone      | string | yes     | Recipient phone number      |
| messageUrl | string | yes     | URL to the voicemail audio |

**Returns:** `Promise<object>` — API response.

**Example:**

```ts
await client.sendRvm({
  phone: '+1234567890',
  messageUrl: 'https://example.com/message.mp3'
});
```

### `sendSms(payload: { phone: string; message: string })`

Sends an SMS message.

**Example:**

```ts
await client.sendSms({
  phone: '+1234567890',
  message: 'Hello from DropCowboy!'
});
```

### Contact List Methods

- `createContactList(payload: { name: string })`
- `getContactList(listId: string)`
- `renameContactList(listId: string, payload: { name: string })`
- `deleteContactList(listId: string)`
- `appendContactsToList(listId: string, payload: { contacts: Array<{ phone: string }> })`

**Example:**

```ts
const list = await client.createContactList({ name: 'Leads' });
await client.appendContactsToList(list.id, { contacts: [{ phone: '+1234567890' }] });
```

### `listBrands(query?: Record<string, any>)`

Lists brands.

**Example:**

```ts
const brands = await client.listBrands({ page: 1, limit: 20 });
```

### `listRecordings(query?: Record<string, any>)`
### `listMedia(query?: Record<string, any>)`
### `listPools(query?: Record<string, any>)`

All accept optional query parameters.

**Example:**

```ts
const recordings = await client.listRecordings({ page: 1 });
const media = await client.listMedia({ type: 'audio' });
const pools = await client.listPools({ active: true });
```

---

## CLI Usage

```bash
# Configure global credentials
dropcowboy config --team-id=<teamId> --secret=<secret>

# Send RVM
dropcowboy send-rvm --phone=+1234567890 --message-url=https://example.com/message.mp3

# Send SMS
dropcowboy send-sms --phone=+1234567890 --message="Hello World"

# Manage contact lists
dropcowboy list-create --name="Leads"
dropcowboy list-append --id=<listId> --contacts='+1234567890,+1987654321'
```

> All CLI commands support `--help` for usage info.

---

## Error Handling

All SDK methods throw errors if credentials are missing or the API responds with an error.

```ts
try {
  await client.sendRvm({ phone: '+1234567890', messageUrl: '...' });
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
