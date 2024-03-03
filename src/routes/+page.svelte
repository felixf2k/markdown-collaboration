<script lang="ts">
    import Content from '$components/Content.svelte';
    import Sidebar from '$components/Sidebar.svelte';
    import { notes } from '$stores/notes.svelte.js';

    let { data } = $props();
    $effect(() => {
        notes.all = data.notes.map((n) => ({
            title: n.title,
            id: n.id,
            active: false,
            open: false,
        }));
    });
</script>

<div class="flex flex-row h-full w-full">
    <Sidebar />
    <Content />
</div>
