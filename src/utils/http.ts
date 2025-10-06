import fetch from 'node-fetch';

export async function request(baseUrl: string, endpoint: string, method: string, teamId: string, secret: string, body?: any) {
    const url = baseUrl.replace(/\/$/, '') + endpoint;

    const opts: any = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'x-team-id': teamId,
            'x-secret': secret,
        }
    };

    if (body !== undefined) opts.body = JSON.stringify(body);

    const res = await fetch(url, opts);
    const text = await res.text();

    try {
        const json = JSON.parse(text);
        if (!res.ok) throw new Error(`API error ${res.status}: ${text}`);
        return json;
    } catch (e) {
        if (!res.ok) throw new Error(`API error ${res.status}: ${text}`);
        return text;
    }
}