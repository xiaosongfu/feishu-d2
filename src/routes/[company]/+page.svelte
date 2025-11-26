<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import type { FeishuRecord } from "$lib/server/feishu";
    import { groupByProject } from "$lib/utils/data";
    import EndpointCard from "$lib/components/EndpointCard.svelte";

    const company = decodeURIComponent($page.params.company ?? "");

    let loading = $state(true);
    let error = $state<string | null>(null);
    let projects = $state<Map<string, FeishuRecord[]>>(new Map());

    onMount(async () => {
        try {
            const response = await fetch("/api/data");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch data");
            }

            const records: FeishuRecord[] = data.data.items;
            const companyRecords = records.filter(
                (record) => String(record.fields["公司"]) === company,
            );
            projects = groupByProject(companyRecords);
        } catch (err) {
            error =
                err instanceof Error ? err.message : "Unknown error occurred";
        } finally {
            loading = false;
        }
    });

    const projectCount = $derived(projects.size);
    const totalEndpoints = $derived(
        Array.from(projects.values()).reduce(
            (sum, endpoints) => sum + endpoints.length,
            0,
        ),
    );
</script>

<div class="container">
    <div class="header">
        <div class="header-content">
            <a href="/" class="back-btn">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                返回
            </a>
            <div>
                <h1>{company}</h1>
                <span class="badge"
                    >{projectCount} 个项目 · {totalEndpoints} 个端</span
                >
            </div>
        </div>
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
        </div>
    {:else if projects.size === 0}
        <div class="loading">
            <p>该公司暂无项目数据</p>
        </div>
    {:else}
        {#each Array.from(projects.entries()) as [projectName, endpoints]}
            <div class="project-section">
                <div class="project-header">
                    <h2>{projectName}</h2>
                    <p style="color: var(--text-muted);">
                        {endpoints.length} 个端
                    </p>
                </div>
                <div class="endpoint-grid">
                    {#each endpoints as endpoint}
                        <EndpointCard record={endpoint} />
                    {/each}
                </div>
            </div>
        {/each}
    {/if}
</div>
