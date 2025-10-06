import { getGlobalConfig } from './config';
import { request } from './utils/http';

export interface DropCowboyOptions {
    teamId?: string;
    secret?: string;
    baseUrl?: string;
}

export class DropCowboy {
    private teamId: string;
    private secret: string;
    private baseUrl: string;

    constructor(options: DropCowboyOptions = {}) {
        const global = getGlobalConfig();

        const teamId = options.teamId ?? global.teamId;
        const secret = options.secret ?? global.secret;
        const baseUrl = options.baseUrl ?? global.baseUrl ?? 'https://api.dropcowboy.com/v1';

        if (!teamId || !secret) {
            throw new Error('Missing DropCowboy credentials (team_id and secret). Set global config or pass them to the constructor.');
        }

        this.teamId = teamId;
        this.secret = secret;
        this.baseUrl = baseUrl;
    }

    // 1) Send ringless voicemail
    async sendRvm(payload: any) {
        return request(this.baseUrl, '/rvm', 'POST', this.teamId, this.secret, payload);
    }

    // 2) Send SMS
    async sendSms(payload: any) {
        return request(this.baseUrl, '/sms', 'POST', this.teamId, this.secret, payload);
    }

    // 3) Contact lists
    async createContactList(payload: any) {
        return request(this.baseUrl, '/list', 'POST', this.teamId, this.secret, payload);
    }

    async getContactList(listId: string) {
        return request(this.baseUrl, `/list/${listId}`, 'GET', this.teamId, this.secret);
    }

    async renameContactList(listId: string, payload: any) {
        // spec uses POST for rename on /list/{list_id}
        return request(this.baseUrl, `/list/${listId}`, 'POST', this.teamId, this.secret, payload);
    }

    async deleteContactList(listId: string) {
        return request(this.baseUrl, `/list/${listId}`, 'DELETE', this.teamId, this.secret);
    }

    async appendContactsToList(listId: string, payload: any) {
        return request(this.baseUrl, `/list/${listId}/contacts`, 'POST', this.teamId, this.secret, payload);
    }

    // 4) Brand
    async listBrands(query?: Record<string, any>) {
        const qs = query ? ('?' + new URLSearchParams(query).toString()) : '';
        return request(this.baseUrl, `/brand${qs}`, 'GET', this.teamId, this.secret);
    }

    // 5) Recordings / Media
    async listRecordings(query?: Record<string, any>) {
        const qs = query ? ('?' + new URLSearchParams(query).toString()) : '';
        return request(this.baseUrl, `/recording${qs}`, 'GET', this.teamId, this.secret);
    }

    async listMedia(query?: Record<string, any>) {
        const qs = query ? ('?' + new URLSearchParams(query).toString()) : '';
        return request(this.baseUrl, `/media${qs}`, 'GET', this.teamId, this.secret);
    }

    // 6) Pools
    async listPools(query?: Record<string, any>) {
        const qs = query ? ('?' + new URLSearchParams(query).toString()) : '';
        return request(this.baseUrl, `/pool${qs}`, 'GET', this.teamId, this.secret);
    }
}


export default DropCowboy;