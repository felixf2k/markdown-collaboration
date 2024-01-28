import { writable } from 'svelte/store';

type ToastSettings = {
    message: string;
    autohide?: boolean;
    timeout?: number;
    className?: string;
    hideDismiss?: boolean;
};

type Toast = ToastSettings & {
    id: string;
    timeoutId?: ReturnType<typeof setTimeout>;
};

const toastDefaults: ToastSettings = {
    message: 'Missing Toast Message',
    autohide: true,
    timeout: 5000,
};

function pseudoRandomUUID(): string {
    const random = Math.random();
    return Number(random).toString(32);
}

export type ToastStore = ReturnType<typeof createToastStore>;
const createToastStore = () => {
    const { subscribe, set, update } = writable<Toast[]>([]);

    /** Remove toast in queue*/
    const close = (id: string) =>
        update((tStore) => {
            if (tStore.length > 0) {
                const index = tStore.findIndex((t) => t.id === id);
                const selectedToast = tStore[index];
                if (selectedToast) {
                    // Clear timeout
                    if (selectedToast.timeoutId)
                        clearTimeout(selectedToast.timeoutId);
                    // Remove
                    tStore.splice(index, 1);
                }
            }
            return tStore;
        });

    // If toast should auto-hide, wait X time, then close by ID
    function handleAutoHide(toast: Toast) {
        if (toast.autohide === true) {
            return setTimeout(() => {
                close(toast.id);
            }, toast.timeout);
        }
    }

    return {
        subscribe,
        close,
        /** Add a new toast to the queue. */
        trigger: (toast: ToastSettings) => {
            // generate random toast id
            const id: string = pseudoRandomUUID();
            update((tStore) => {
                // if hideDismiss is true enable autohide so we don't have forever toasts
                if (toast.hideDismiss) toast.autohide = true;
                // Merge with defaults
                const tMerged: Toast = { ...toastDefaults, ...toast, id };
                // Handle auto-hide
                tMerged.timeoutId = handleAutoHide(tMerged);
                // Push into store
                tStore.push(tMerged);
                // Return
                return tStore;
            });
            return id;
        },
        /** Call to prevent the toast from auto-hiding */
        freeze: (index: number) =>
            update((tStore) => {
                if (tStore.length > 0) clearTimeout(tStore[index].timeoutId);
                return tStore;
            }),
        /** Re-enable auto hide */
        unfreeze: (index: number) =>
            update((tStore) => {
                if (tStore.length > 0)
                    tStore[index].timeoutId = handleAutoHide(tStore[index]);
                return tStore;
            }),
        /** Clear all toasts */
        clear: () => set([]),
    };
};

/** Exposes functions to manage toasts, contains currently active toasts */
export const toasts = createToastStore();
