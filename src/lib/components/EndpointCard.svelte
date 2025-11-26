<script lang="ts">
	import type { FeishuRecord } from '$lib/server/feishu';
	import { extractText, getAbsolutePath, generateAppUrl } from '$lib/utils/data';
	import { settings } from '$lib/stores/settings';

	interface Props {
		record: FeishuRecord;
	}

	let { record }: Props = $props();

	const fields = record.fields;
	const name = extractText(fields['端名称']);
	const description = extractText(fields['端描述']);
	const repoLink = fields['端仓库链接'] as { link: string; text: string; type: 'url' } | undefined;
	const apps = (fields['端关联应用'] as string[]) || [];
	const localPath = extractText(fields['端本地路径']);

	function handleAppClick(appName: string) {
		const absolutePath = getAbsolutePath($settings.basePath, localPath);
		const url = generateAppUrl(appName, absolutePath);
		console.log(`Opening: ${url}`);
		window.location.href = url;
	}
</script>

<div class="endpoint-card">
	<div class="endpoint-header">
		<h3 class="endpoint-title">{name}</h3>
		<p class="endpoint-description">{description}</p>
	</div>

	{#if repoLink}
		<a href={repoLink.link} target="_blank" rel="noopener noreferrer" class="endpoint-link">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
				<polyline points="15 3 21 3 21 9"></polyline>
				<line x1="10" y1="14" x2="21" y2="3"></line>
			</svg>
			查看仓库
		</a>
	{/if}

	{#if apps.length > 0}
		<div class="endpoint-apps">
			{#each apps as app}
				<button class="app-badge" onclick={() => handleAppClick(app)}>
					{app}
				</button>
			{/each}
		</div>
	{/if}

	{#if localPath}
		<div class="endpoint-path">
			📁 {localPath}
		</div>
	{/if}
</div>
