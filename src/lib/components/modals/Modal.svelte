<script lang="ts">
    import { focusTrap } from '$functions/focusTrap';
    import { faX } from '@fortawesome/pro-light-svg-icons';
    import Fa from 'svelte-fa';
    import { blur } from 'svelte/transition';

    let clazz = '';
    export { clazz as class };
    export let b_open: boolean,
        style = '';

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Escape') b_open = false;
    };
</script>

{#if b_open}
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <dialog
        class="text-surface-800-100-token fixed left-0 top-0 z-10 m-0 h-full w-full bg-transparent p-0"
        open
        use:focusTrap={true}
        on:keydown={onKeyDown}
    >
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="flex h-full w-full items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            on:click={() => {
                b_open = false;
            }}
            transition:blur={{ duration: 200 }}
        >
            <div
                class="card bg-surface-50-900-token relative max-h-[calc(100%-2rem)] rounded-xl p-1.5 {clazz}"
                on:click|stopPropagation
                {style}
                transition:blur={{ duration: 200 }}
            >
                <button
                    type="button"
                    class="text-surface-900-50-token absolute right-2.5 top-2.5 p-2"
                    on:click={() => {
                        b_open = false;
                    }}
                >
                    <Fa icon={faX} class="" />
                </button>
                <slot />
            </div>
        </div>
    </dialog>
{/if}
