#!/usr/bin/env node
import { Command } from 'commander';
import { setGlobalConfig, getGlobalConfig } from '../config';
import DropCowboy from '..';

const program = new Command();

program.name('dropcowboy').description('CLI for DropCowboy API').version('1.0.0');

function toSnakeCasePayload(opts: Record<string, any>) {
    const payload: Record<string, any> = {};
    Object.entries(opts).forEach(([key, value]) => {
        if (typeof value !== 'function' && key !== 'parent') {
            const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            payload[snakeKey] = value;
        }
    });
    return payload;
}

program
    .command('config')
    .description('Set global credentials')
    .requiredOption('--team-id <teamId>')
    .requiredOption('--secret <secret>')
    .option('--base-url <baseUrl>')
    .action((opts: { teamId: string; secret: string; baseUrl: string | undefined; }) => {
        setGlobalConfig(opts.teamId, opts.secret, opts.baseUrl);
        console.log('✅ Saved credentials to ~/.dropcowboyrc');
    });

program
    .command('send-rvm')
    .description('Send ringless voicemail (rvm)')
    .requiredOption('--brand-id <brandId>')
    .requiredOption('--phone-number <phoneNumber>')
    .option('--audio-url <audioUrl>')
    .option('--audio-type <audioType>')
    .option('--recording-id <recordingId>')
    .option('--voice-id <voiceId>')
    .option('--tts-body <ttsBody>')
    .option('--forwarding-number <forwardingNumber>')
    .option('--status-format <statusFormat>')
    .option('--byoc <byoc>')
    .option('--foreign-id <foreignId>')
    .option('--privacy <privacy>')
    .option('--phone-ivr-id <phoneIvrId>')
    .option('--pool-id <poolId>')
    .option('--postal-code <postalCode>')
    .option('--callback-url <callbackUrl>')
    .action(async (opts: any) => {
        const cfg = getGlobalConfig();
        const client = new DropCowboy(cfg);
        const payload = toSnakeCasePayload(opts);
        console.log(await client.sendRvm(payload));
    });

program
    .command('send-sms')
    .description('Send SMS')
    .requiredOption('--caller-id <callerId>')
    .requiredOption('--phone-number <phoneNumber>')
    .requiredOption('--pool-id <poolId>')
    .requiredOption('--sms-body <smsBody>')
    .requiredOption('--opt-in <optIn>')
    .option('--foreign-id <foreignId>')
    .option('--callback-url <callbackUrl>')
    .action(async (opts: any) => {
        const cfg = getGlobalConfig();
        const client = new DropCowboy(cfg);
        const payload = toSnakeCasePayload(opts);
        console.log(await client.sendSms(payload));
    });


program
    .command('contact-list-create')
    .description('Create a contact list')
    .requiredOption('--name <name>')
    .action(async (opts: { name: any; }) => {
        const cfg = getGlobalConfig();
        const client = new DropCowboy(cfg);
        console.log(await client.createContactList({ list_name: opts.name }));
    });

program
    .command('contact-list-get')
    .description('Get contact list details')
    .requiredOption('--id <id>')
    .action(async (opts: { id: string; }) => {
        const cfg = getGlobalConfig();
        const client = new DropCowboy(cfg);
        console.log(await client.getContactList(opts.id));
    });

program
    .command('contact-list-rename')
    .description('Rename contact list')
    .requiredOption('--id <id>')
    .requiredOption('--name <name>')
    .action(async (opts: { id: string; name: any; }) => {
        const cfg = getGlobalConfig();
        const client = new DropCowboy(cfg);
        console.log(await client.renameContactList(opts.id, { list_name: opts.name }));
    });

program
    .command('contact-list-delete')
    .description('Delete contact list')
    .requiredOption('--id <id>')
    .action(async (opts: { id: string; }) => {
        const cfg = getGlobalConfig();
        const client = new DropCowboy(cfg);
        console.log(await client.deleteContactList(opts.id));
    });

program
    .command('contact-list-append')
    .description('Append contacts to a list')
    .requiredOption('--id <id>')
    .requiredOption('--fields <fields>', 'Comma-separated list of field names')
    .requiredOption('--values <values>', 'JSON array of arrays for contact values')
    .option('--region <region>', 'Optional JSON array of field types')
    .action(async (opts: any) => {
        const cfg = getGlobalConfig();
        const client = new DropCowboy(cfg);

        const payload: { fields: any; values: any; region?: any } = {
            fields: opts.fields.split(','),
            values: JSON.parse(opts.values)
        };

        if (opts.region) payload.region = JSON.parse(opts.region);

        console.log(await client.appendContactsToList(opts.id, payload));
    });

program
    .command('brands')
    .description('List brands')
    .action(async () => {
        const cfg = getGlobalConfig();
        const client = new DropCowboy(cfg);
        const payload: Record<string, any> = {};
        console.log(await client.listBrands(payload));
    });

program
    .command('recordings')
    .description('List recordings')
    .option('--api-allowed <apiAllowed>')
    .action(async (opts: { apiAllowed: string; }) => {
        const cfg = getGlobalConfig();
        const client = new DropCowboy(cfg);

        const payload: Record<string, any> = {};
        if (opts.apiAllowed !== undefined) payload['api_allowed'] = opts.apiAllowed === 'true';

        console.log(await client.listRecordings(payload));
    });

program
    .command('pools')
    .description('List number pools')
    .action(async () => {
        const cfg = getGlobalConfig();
        const client = new DropCowboy(cfg);
        console.log(await client.listPools());
    });

program.parseAsync();