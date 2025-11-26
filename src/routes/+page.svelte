<script lang="ts">
    import { onMount } from "svelte";
    import type { FeishuRecord } from "$lib/server/feishu";
    import { getUniqueCompanies } from "$lib/utils/data";

    let loading = $state(true);
    let error = $state<string | null>(null);
    let companies = $state<string[]>([]);

    onMount(async () => {
        try {
            const response = await fetch("/api/data");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch data");
            }

            const records: FeishuRecord[] = data.data.items;
            companies = getUniqueCompanies(records);
        } catch (err) {
            error =
                err instanceof Error ? err.message : "Unknown error occurred";
        } finally {
            loading = false;
        }
    });
</script>

<div class="container">
    <div class="header">
        <h1>飞书数据导航器</h1>
        <p style="color: var(--text-secondary); font-size: 1.1rem;">
            选择公司查看项目详情
        </p>
    </div>

    {#if loading}
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>加载中...</p>
        </div>
    {:else if error}
        <div class="error">
            <h3>加载失败</h3>
            <p>{error}</p>
            <p style="margin-top: 1rem; font-size: 0.9rem;">
                请检查 .env 文件中的飞书配置是否正确
            </p>
        </div>
    {:else if companies.length === 0}
        <div class="loading">
            <p>暂无数据</p>
        </div>
    {:else}
        <div class="company-grid">
            {#each companies as company}
                <a href="/{encodeURIComponent(company)}" class="company-card">
                    <h2>{company}</h2>
                </a>
            {/each}
        </div>
    {/if}
</div>
