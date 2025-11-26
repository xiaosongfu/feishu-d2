import type { FeishuRecord, FeishuTextField } from '$lib/server/feishu';

/**
 * Extract text from Feishu field format
 */
export function extractText(field: any): string {
    if (!field) return '';
    if (Array.isArray(field)) {
        return field.map((item: FeishuTextField | string) =>
            typeof item === 'string' ? item : item.text || item
        ).join(', ');
    }
    if (typeof field === 'object' && 'text' in field) {
        return field.text;
    }
    return String(field);
}

/**
 * Get unique companies from records
 */
export function getUniqueCompanies(records: FeishuRecord[]): string[] {
    const companies = new Set<string>();
    records.forEach(record => {
        const company = record.fields['公司'];
        if (company) {
            companies.add(String(company));
        }
    });
    return Array.from(companies).sort();
}

/**
 * Group records by company
 */
export function groupByCompany(records: FeishuRecord[]): Map<string, FeishuRecord[]> {
    const grouped = new Map<string, FeishuRecord[]>();

    records.forEach(record => {
        const company = String(record.fields['公司'] || '');
        if (!grouped.has(company)) {
            grouped.set(company, []);
        }
        grouped.get(company)!.push(record);
    });

    return grouped;
}

/**
 * Group records by project within a company
 */
export function groupByProject(records: FeishuRecord[]): Map<string, FeishuRecord[]> {
    const grouped = new Map<string, FeishuRecord[]>();

    records.forEach(record => {
        const project = String(record.fields['项目'] || '未分类');
        if (!grouped.has(project)) {
            grouped.set(project, []);
        }
        grouped.get(project)!.push(record);
    });

    return grouped;
}

/**
 * Get absolute path by concatenating base path with relative path
 */
export function getAbsolutePath(basePath: string, relativePath: string): string {
    if (!basePath) return relativePath;
    const base = basePath.endsWith('/') ? basePath : basePath + '/';
    return base + relativePath;
}

/**
 * Get app protocol URL for opening local apps
 */
export function getAppProtocol(appName: string): string {
    const protocols: Record<string, string> = {
        'Zed': 'zed',
        'WebStorm': 'webstorm',
        'Cursor': 'cursor',
        'VSCode': 'vscode',
        'Visual Studio Code': 'vscode',
        'IntelliJ': 'idea',
        'IntelliJ IDEA': 'idea',
        'PyCharm': 'pycharm',
        'GoLand': 'goland',
        'Sublime Text': 'subl',
    };
    return protocols[appName] || appName.toLowerCase();
}

/**
 * Generate app protocol URL
 */
export function generateAppUrl(appName: string, absolutePath: string): string {
    const protocol = getAppProtocol(appName);
    return `${protocol}://file/${absolutePath}`;
}
