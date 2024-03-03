<script lang="ts">
    import { trpc } from '$lib/trpc/client';
    import { notes } from '$stores/notes.svelte';
    import { createNoteSubscribtion } from '$stores/subscription.svelte';
    import { toasts } from '$stores/toasts';
    import { faTrashCan } from '@fortawesome/pro-light-svg-icons';
    import { marked } from 'marked';
    import { onDestroy } from 'svelte';
    import Fa from 'svelte-fa';

    let { id } = $props<{ id: string }>();
    let note = createNoteSubscribtion(id);

    const markdown = $derived(marked(note.value.content));

    const deleteNote = async () => {
        try {
            await trpc().note.delete.mutate(id);
            notes.deleteNote(id);
        } catch (error) {
            toasts.trigger({
                message: 'Note konnte nicht erstellt werden',
                className: 'variant-filled-error',
            });
        }
    };

    onDestroy(() => {
        note.unsubscribe();
    });
</script>

{#if note}
    <div class="w-full h-full flex flex-row gap-2">
        <div class="flex flex-col w-1/2 gap-2 h-full">
            <div class="flex flex-row items-center gap-2">
                <input
                    type="text"
                    class="input"
                    value={note.value.title}
                    on:input={(e) => {
                        note.update({
                            ...note.value,
                            title: e.currentTarget.value,
                        });
                    }}
                />
                <button on:click={deleteNote} class="btn-icon">
                    <Fa icon={faTrashCan} />
                </button>
            </div>
            <textarea
                class="input flex-grow h-full"
                value={note.value.content}
                on:input={(e) => {
                    note.update({
                        ...note.value,
                        content: e.currentTarget.value,
                    });
                }}
            />
        </div>
        <div class="w-1/2">
            {@html markdown}
        </div>
    </div>
{/if}

<style lang="scss">
    :global(.h1) {
        font-size: 1.5rem !important;
    }
</style>
