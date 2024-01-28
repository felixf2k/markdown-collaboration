<script lang="ts">
    import { browser } from '$app/environment';
    import { invalidateAll } from '$app/navigation';
    import Toggle from '$components/Toggle.svelte';
    import type { Note } from '$lib/schemas';
    import { trpc } from '$lib/trpc/client';
    import { tabs } from '$stores/tabs';
    import { toasts } from '$stores/toasts';
    import { faPlus } from '@fortawesome/pro-solid-svg-icons';
    import Fa from 'svelte-fa';

    export let notes: Note[];

    let darkMode = true;
    $: {
        if (browser) {
            const html = document.getElementsByTagName('html')[0];
            if (darkMode) {
                html.className = 'dark';
            } else {
                html.className = '';
            }
        }
    }

    const createNote = async () => {
        try {
            const id = await trpc().note.create.mutate({
                content: '',
                title: '',
            });
            tabs.open({ id, title: 'New Note' });
            invalidateAll();
        } catch (error) {
            toasts.trigger({
                message: "Couldn't create the note",
                className: 'variant-filled-error',
            });
        }
    };

    const openNote = (note: Note) => {
        tabs.open({
            id: note.id,
            title: note.title ?? 'New Note',
        });
    };
</script>

<div
    class="flex flex-col shadow-xl h-full p-2 justify-between bg-surface-100-800-token"
>
    <div class="flex flex-col">
        <button
            class="btn flex flex-row items-center gap-2"
            type="button"
            on:click={createNote}
        >
            New note
            <Fa icon={faPlus} />
        </button>
        {#each notes as note (note.id)}
            {note.id}
            <button
                type="button"
                class="btn flex flex-row gap-2 p-2"
                on:click={() => {
                    openNote(note);
                }}
            >
                {#if note.title === ''}
                    New Note
                {:else}
                    {note.title}
                {/if}
            </button>
        {/each}
    </div>

    <div class="flex flex-row items-center gap-2">
        Dark Mode
        <Toggle bind:b_value={darkMode} class="justify-self-end" />
    </div>
</div>
