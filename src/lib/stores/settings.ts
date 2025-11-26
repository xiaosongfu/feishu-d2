import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Settings store with localStorage persistence
function createSettingsStore() {
    const defaultSettings = {
        basePath: '',
    };

    // Initialize from localStorage if in browser
    const initialValue = browser
        ? JSON.parse(localStorage.getItem('d2-settings') || JSON.stringify(defaultSettings))
        : defaultSettings;

    const { subscribe, set, update } = writable(initialValue);

    return {
        subscribe,
        set: (value: typeof defaultSettings) => {
            if (browser) {
                localStorage.setItem('d2-settings', JSON.stringify(value));
            }
            set(value);
        },
        update: (fn: (value: typeof defaultSettings) => typeof defaultSettings) => {
            update((current) => {
                const newValue = fn(current);
                if (browser) {
                    localStorage.setItem('d2-settings', JSON.stringify(newValue));
                }
                return newValue;
            });
        },
        setBasePath: (basePath: string) => {
            update((current) => {
                const newValue = { ...current, basePath };
                if (browser) {
                    localStorage.setItem('d2-settings', JSON.stringify(newValue));
                }
                return newValue;
            });
        },
    };
}

export const settings = createSettingsStore();
