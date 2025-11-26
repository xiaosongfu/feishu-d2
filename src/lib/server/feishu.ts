// Feishu API Types
export interface FeishuTableField {
    [key: string]: string | FeishuUrlField | string[] | FeishuTextField[] | any;
}

export interface FeishuUrlField {
    link: string;
    text: string;
    type: 'url';
}

export interface FeishuTextField {
    text: string;
    type: 'text';
}

export interface FeishuRecord {
    fields: FeishuTableField;
    record_id: string;
}

export interface FeishuTableResponse {
    code: number;
    data: {
        has_more: boolean;
        items: FeishuRecord[];
        total: number;
        page_token?: string;
    };
    msg: string;
}

export interface FeishuTokenResponse {
    code: number;
    tenant_access_token: string;
    expire: number;
    msg: string;
}

// Token cache
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

import { env } from '$env/dynamic/private';

const FEISHU_APP_ID = env.FEISHU_APP_ID || '';
const FEISHU_APP_SECRET = env.FEISHU_APP_SECRET || '';
const FEISHU_TABLE_APP_TOKEN = env.FEISHU_TABLE_APP_TOKEN || '';
const FEISHU_TABLE_ID = env.FEISHU_TABLE_ID || '';
const FEISHU_API_ENDPOINT = env.FEISHU_API_ENDPOINT || 'https://open.feishu.cn';

/**
 * Get tenant access token from Feishu API
 * Caches the token until it expires
 */
export async function getTenantAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (cachedToken && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    try {
        const response = await fetch(`${FEISHU_API_ENDPOINT}/open-apis/auth/v3/tenant_access_token/internal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                app_id: FEISHU_APP_ID,
                app_secret: FEISHU_APP_SECRET,
            }),
        });

        const data: FeishuTokenResponse = await response.json();

        if (data.code !== 0) {
            throw new Error(`Failed to get access token: ${data.msg}`);
        }

        // Cache token (expire 10 minutes before actual expiry for safety)
        cachedToken = data.tenant_access_token;
        tokenExpiry = Date.now() + (data.expire - 600) * 1000;

        return cachedToken;
    } catch (error) {
        console.error('Error getting tenant access token:', error);
        throw error;
    }
}

/**
 * Fetch all records from Feishu table
 * Handles pagination automatically
 */
export async function getTableRecords(): Promise<FeishuRecord[]> {
    const token = await getTenantAccessToken();
    const allRecords: FeishuRecord[] = [];
    let pageToken: string | undefined;
    let hasMore = true;

    try {
        while (hasMore) {
            const url = new URL(
                `${FEISHU_API_ENDPOINT}/open-apis/bitable/v1/apps/${FEISHU_TABLE_APP_TOKEN}/tables/${FEISHU_TABLE_ID}/records`
            );

            // Add pagination parameters
            url.searchParams.set('page_size', '500');
            if (pageToken) {
                url.searchParams.set('page_token', pageToken);
            }

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data: FeishuTableResponse = await response.json();

            if (data.code !== 0) {
                throw new Error(`Failed to fetch table records: ${data.msg}`);
            }

            allRecords.push(...data.data.items);
            hasMore = data.data.has_more;
            pageToken = data.data.page_token;
        }

        return allRecords;
    } catch (error) {
        console.error('Error fetching table records:', error);
        throw error;
    }
}

/**
 * Validate environment variables
 */
export function validateConfig(): { valid: boolean; missing: string[] } {
    const required = {
        FEISHU_APP_ID,
        FEISHU_APP_SECRET,
        FEISHU_TABLE_APP_TOKEN,
        FEISHU_TABLE_ID,
    };

    const missing = Object.entries(required)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

    return {
        valid: missing.length === 0,
        missing,
    };
}
