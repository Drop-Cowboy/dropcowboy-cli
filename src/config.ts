import fs from 'fs';
import os from 'os';
import path from 'path';

const CONFIG_PATH = path.join(os.homedir(), '.dropcowboyrc');

export function setGlobalConfig(teamId: string, secret: string, baseUrl?: string) {
    const payload: any = { teamId, secret };

    if (baseUrl) payload.baseUrl = baseUrl;

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(payload, null, 2), { encoding: 'utf-8' });
}

export function getGlobalConfig(): { teamId?: string; secret?: string; baseUrl?: string } {
    try {
        if (!fs.existsSync(CONFIG_PATH)) return {};
        
        return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    } catch (err) {
        return {};
    }
}