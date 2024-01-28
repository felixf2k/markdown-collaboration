<script lang="ts">
    import { onMount } from 'svelte';

    let ws: WebSocket;
    let myMessage = '';
    let messages: string[] = [];

    onMount(() => {
        ws = new WebSocket('ws://localhost:8080');
        ws.addEventListener('message', (message) => {
            console.log('message received', message.data);
            messages.push(message.data);
            messages = messages;
        });
        ws.addEventListener('open', () => {
            console.log('opened ws connection');
        });
    });
</script>

<div class="flex flex-col">
    {#each messages as msg}
        <p>{msg}</p>
    {/each}
</div>

<input type="text" bind:value={myMessage} />
<button
    on:click={() => {
        ws.send(myMessage);
    }}
>
    Send message
</button>
