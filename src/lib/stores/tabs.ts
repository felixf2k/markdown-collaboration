import { writable } from 'svelte/store';

type Tab = { id: string; title: string };

export const tabs = createTabStore();
export const activeTab = writable<Tab>();

function createTabStore() {
    const { subscribe, update } = writable<Tab[]>([]);

    const close = (id: string) => {
        update((current) => current.filter((c) => c.id !== id));
    };

    const open = (t: Tab) => {
        update((current) => [...current, t]);
        activeTab.set(t);
    };

    return {
        subscribe,
        close,
        open,
    };
}
