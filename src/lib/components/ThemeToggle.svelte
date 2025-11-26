<script lang="ts">
    import { onMount } from "svelte";

    let isDark = $state(true);

    onMount(() => {
        // Check local storage or system preference
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            isDark = savedTheme === "dark";
        } else {
            isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        }
        applyTheme();
    });

    function applyTheme() {
        if (isDark) {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
        } else {
            document.documentElement.classList.add("light");
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }

    function toggleTheme() {
        isDark = !isDark;
        applyTheme();
    }
</script>

<button
    class="theme-toggle-btn"
    onclick={toggleTheme}
    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
>
    {#if isDark}
        <!-- Sun icon for dark mode -->
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
    {:else}
        <!-- Moon icon for light mode -->
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    {/if}
</button>

<style>
    .theme-toggle-btn {
        position: fixed;
        bottom: var(--spacing-lg);
        right: calc(
            var(--spacing-lg) + 70px
        ); /* Position to the left of settings button */
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--bg-card);
        border: 1px solid var(--border-color, rgba(99, 102, 241, 0.2));
        color: var(--text-primary);
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        transition: all var(--transition-base);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
    }

    .theme-toggle-btn:hover {
        box-shadow: var(--shadow-xl), var(--shadow-glow);
        transform: scale(1.1);
        background: var(--bg-card-hover);
        color: var(--accent-primary);
    }

    @media (max-width: 768px) {
        .theme-toggle-btn {
            width: 50px;
            height: 50px;
            bottom: var(--spacing-md);
            right: calc(var(--spacing-md) + 60px);
        }
    }
</style>
