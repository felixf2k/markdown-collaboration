<script lang="ts">
    import { browser } from '$app/environment';
    import Toggle from '$components/Toggle.svelte';

    export let notes: string[];

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
</script>

<div class="flex flex-col shadow-md h-full p-2 justify-between">
    <div class="flex flex-col">
        <button class=""> </button>
        {#each notes as note}
            <div class="flex flex-row gap-2 p-2">
                {note}
            </div>
        {/each}
    </div>

    <div class="flex flex-row items-center gap-2">
        Dark Mode
        <Toggle bind:b_value={darkMode} class="justify-self-end" />
    </div>
</div>
