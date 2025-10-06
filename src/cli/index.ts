#!/usr/bin/env node
import { Command } from 'commander';
import { setGlobalConfig, getGlobalConfig } from '../config';
import DropCowboy from '..';

const program = new Command();

program.name('dropcowboy').description('CLI for DropCowboy API').version('1.0.0');

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
    .requiredOption('--to <to>')
    .requiredOption('--media-id <mediaId>')
    .action(async (opts: { to: any; mediaId: any; }) => {
        const cfg = getGlobalConfig();
        const client = new DropCowboy(cfg);
        const payload = { to: opts.to, media_id: opts.mediaId };
        console.log(await client.sendRvm(payload));
    });

program
    .command('send-sms')
    .description('Send SMS')
    .requiredOption('--to <to>')
    .requiredOption('--body <body>')
    .action(async (opts: { to: any; body: any; }) => {
        const cfg = getGlobalConfig();
        const client = new DropCowboy(cfg);
        const payload = { to: opts.to, body: opts.body };
        console.log(await client.sendSms(payload));
    });


program
    .command('contact-list-create')
    .description('Create a contact list')
    .requiredOption('--name <name>')
    .action(async (opts: { name: any; }) => {
        const cfg = getGlobalConfig();
        const client = new DropCowboy(cfg);
        console.log(await client.createContactList({ name: opts.name }));
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
        console.log(await client.renameContactList(opts.id, { name: opts.name }));
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
    .description('Append contacts to a list (JSON array via --file)')
    .requiredOption('--id <id>')
    .requiredOption('--file <file>')
    .action(async (opts: { file: any; id: string; }) => {
        const fs = await import('fs');
        const data = JSON.parse(fs.readFileSync(opts.file, 'utf-8'));
        const cfg = getGlobalConfig();
        const client = new DropCowboy(cfg);
        console.log(await client.appendContactsToList(opts.id, data));
    });

program
    .command('brands')
    .description('List brands')
    .action(async () => {
        const cfg = getGlobalConfig();
        const client = new DropCowboy(cfg);
        console.log(await client.listBrands());
    });

program
    .command('recordings')
    .description('List recordings')
    .action(async () => {
        const cfg = getGlobalConfig();
        const client = new DropCowboy(cfg);
        console.log(await client.listRecordings());
    });

program
    .command('media')
    .description('List media')
    .action(async () => {
        const cfg = getGlobalConfig();
        const client = new DropCowboy(cfg);
        console.log(await client.listMedia());
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