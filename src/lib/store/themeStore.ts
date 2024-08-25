import { writable } from 'svelte/store';

export const themeStore = writable<boolean|null>(null);