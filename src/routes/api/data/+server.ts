import { json } from '@sveltejs/kit';
import { getTableRecords, validateConfig } from '$lib/server/feishu';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    try {
        // Validate configuration
        const config = validateConfig();
        if (!config.valid) {
            return json(
                {
                    error: 'Missing Feishu configuration',
                    missing: config.missing,
                    message: 'Please configure environment variables in .env file',
                },
                { status: 500 }
            );
        }

        // Fetch data from Feishu
        const records = await getTableRecords();

        return json({
            code: 0,
            data: {
                has_more: false,
                items: records,
                total: records.length,
            },
            msg: 'success',
        });
    } catch (error) {
        console.error('Error in /api/data:', error);
        return json(
            {
                error: 'Failed to fetch data from Feishu',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
};
