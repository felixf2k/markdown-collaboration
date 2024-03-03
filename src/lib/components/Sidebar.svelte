<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import Toggle from '$components/Toggle.svelte';
    import { trpc } from '$lib/trpc/client';
    import { notes, type NoteTab } from '$stores/notes.svelte';
    import { toasts } from '$stores/toasts';
    import { faPlus } from '@fortawesome/pro-solid-svg-icons';
    import Fa from 'svelte-fa';

    let darkMode = $state(true);

    $effect(function updateDarkMode() {
        const html = document.getElementsByTagName('html')[0];
        if (darkMode) {
            html.className = 'dark';
        } else {
            html.className = '';
        }
    });

    const createNote = async () => {
        try {
            const id = await trpc().note.create.mutate({
                content: '',
                title: '',
            });
            notes.open(id);
            invalidateAll();
        } catch (error) {
            toasts.trigger({
                message: "Couldn't create the note",
                className: 'variant-filled-error',
            });
        }
    };

    const openNote = (id: string) => {
        notes.open(id);
    };
</script>

{#snippet noteRow(note: NoteTab)}
    <button
        type="button"
        class="btn
        block
        gap-2
        p-2
        max-w-full
        overflow-hidden
        text-ellipsis
        text-start
        {note.open ? 'bg-surface-200-700-token' : ''}"
        on:click={() => {
            openNote(note.id);
        }}
    >
        {#if note.title === ''}
            New Note
        {:else}
            {note.title}
        {/if}
    </button>
{/snippet}

<div
    class="flex flex-col shadow-xl h-full p-2 items-start overflow-hidden justify-between bg-surface-100-800-token w-64"
>
    <div class="flex flex-col gap-2 w-full overflow-hidden">
        {#each notes.all as note (note.id)}
            {@render noteRow(note)}
        {/each}
        <button
            class="btn flex flex-row items-center gap-2 variant-ghost-primary"
            type="button"
            on:click={createNote}
        >
            New note
            <Fa icon={faPlus} />
        </button>
    </div>

    <div class="flex flex-row items-center gap-2">
        Dark Mode
        <Toggle bind:b_value={darkMode} class="justify-self-end" />
    </div>
</div>
