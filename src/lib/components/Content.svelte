<script lang="ts">
    import Tab from '$components/Tab.svelte';
    import { notes, type NoteTab } from '$stores/notes.svelte';
    import { faX } from '@fortawesome/pro-solid-svg-icons';
    import Fa from 'svelte-fa';
</script>

{#snippet tab(tab: NoteTab)}
    <div
        class="class
            text-lg
            h-fit
            flex
            flex-row
            items-center
            w-fit
            rounded-t-lg
            relative
            px-2
            {tab.active
            ? 'bg-surface-100-800-token before:absolute before:top-0 before:right-full before:block before:h-full before:w-3 before:rounded-br-full before:bg-transparent before:shadow-[0px_0.75rem_0_0px_rgb(var(--color-surface-100))] dark:before:shadow-[0px_0.75rem_0_0px_rgb(var(--color-surface-800))] after:absolute after:top-0 after:left-full after:block after:h-full after:w-3 after:rounded-bl-full after:bg-transparent after:shadow-[0px_0.75rem_0_0px_rgb(var(--color-surface-100))] dark:after:shadow-[0px_0.75rem_0_0px_rgb(var(--color-surface-800))]'
            : ''}"
    >
        <button
            type="button"
            class="p-2 btn"
            on:click={() => {
                notes.select(tab.id);
            }}
        >
            {#if tab.title === ''}
                New Note
            {:else}
                {tab.title}
            {/if}
        </button>
        <button
            type="button"
            class="h-8 w-8 flex items-center justify-center btn-icon"
            on:click={() => {
                notes.close(tab.id);
            }}
        >
            <Fa icon={faX} />
        </button>
    </div>
{/snippet}

<div class="flex grow flex-col m-2">
    <div class="w-full flex flex-row items-center gap-4 px-8">
        {#each notes.openNotes as note (note.id)}
            {@render tab(note)}
        {/each}
    </div>
    {#if notes.active}
        {#key notes.active.id}
            <div class="bg-surface-100-800-token flex-grow rounded-lg p-4">
                <Tab id={notes.active.id} />
            </div>
        {/key}
    {/if}
</div>
