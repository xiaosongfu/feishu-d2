<script lang="ts">
	import "$lib/styles/global.css";
	import SettingsModal from "$lib/components/SettingsModal.svelte";

	let { children } = $props();
	let settingsOpen = $state(false);
</script>

<svelte:head>
	<title>飞书数据导航器</title>
	<meta
		name="description"
		content="飞书多维表格数据导航器 - 优雅的项目管理界面"
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		rel="preconnect"
		href="https://fonts.gstatic.com"
		crossorigin="anonymous"
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{@render children()}

<!-- Settings Button -->
<button
	class="settings-btn"
	onclick={() => (settingsOpen = true)}
	aria-label="设置"
>
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
	>
		<circle cx="12" cy="12" r="3"></circle>
		<path
			d="M12 1v6m0 6v6m0-6h6m-6 0H6m12.364-6.364l-4.243 4.243m0 0l-4.242 4.242m4.242-4.242l4.243 4.243m-4.243-4.243L5.636 5.636"
		></path>
	</svg>
</button>

<!-- Settings Modal -->
<SettingsModal
	bind:isOpen={settingsOpen}
	onClose={() => (settingsOpen = false)}
/>
