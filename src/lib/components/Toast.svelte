<script lang="ts">
    import { toasts } from '$stores/toasts';
    import { faX } from '@fortawesome/pro-solid-svg-icons';
    import Fa from 'svelte-fa';
    import { flip } from 'svelte/animate';
    import { fly, scale } from 'svelte/transition';
</script>

<div
    class="pointer-events-none absolute top-0 flex h-full w-full flex-col items-center justify-end"
>
    <div
        class="pointer-events-auto flex max-h-full flex-col items-center justify-end gap-2 overflow-hidden pb-2"
    >
        {#each $toasts as toast, i (toast)}
            <div
                in:fly={{ y: '100%', duration: 300 }}
                out:scale={{ duration: 300 }}
                animate:flip={{ duration: 300 }}
                on:mouseenter={() => {
                    toasts.freeze(i);
                }}
                on:mouseleave={() => {
                    toasts.unfreeze(i);
                }}
                class="variant-filled-tertiary flex max-w-lg flex-row items-center rounded-xl shadow-lg {toast.hideDismiss
                    ? 'px-5 py-4'
                    : 'pl-4'} {toast.className}"
            >
                {toast.message}
                {#if !toast.hideDismiss}
                    <button
                        type="button"
                        on:click={() => {
                            toasts.close(toast.id);
                        }}
                        class="btn-icon flex h-14 w-12 items-center justify-center"
                    >
                        <Fa icon={faX} />
                    </button>
                {/if}
            </div>
        {/each}
    </div>
</div>
