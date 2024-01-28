<script lang="ts">
    import type { Note } from '$lib/schemas';
    import { createNoteStore } from '$stores/notes';
    import { onMount } from 'svelte';
    import { writable, type Writable } from 'svelte/store';

    export let id: string;
    let note: Omit<Writable<Note>, 'update'> = writable({
        content: '',
        id: '',
        title: '',
    });

    onMount(() => {
        note = createNoteStore(id);
    });
</script>

<input type="text" class="input" bind:value={$note.title} />
<textarea class="input" bind:value={$note.content} />
