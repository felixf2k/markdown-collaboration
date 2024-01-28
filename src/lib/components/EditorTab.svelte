<script lang="ts">
    import { onMount } from 'svelte';

    export let id: string;

    let ws: WebSocket;
    onMount(() => {
        ws = new WebSocket('ws://localhost:8080');
        ws.addEventListener('message', (message) => {});
        ws.addEventListener('open', () => {
            console.log('opened ws connection');
        });
    });
</script>
