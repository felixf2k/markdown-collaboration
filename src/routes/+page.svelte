<script lang="ts">
    import Sidebar from '$components/Sidebar.svelte';
    import Tabs from '$components/Tabs.svelte';

    export let data;
</script>

<div class="flex flex-row h-full w-full">
    <Sidebar notes={data.notes} />
    <Tabs />
</div>
