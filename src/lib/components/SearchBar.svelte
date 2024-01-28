<script lang="ts">
    import {
        faCircleX,
        faMagnifyingGlass,
    } from '@fortawesome/pro-light-svg-icons';
    import { createEventDispatcher, onMount } from 'svelte';
    import Fa from 'svelte-fa';

    let clazz = '';
    export { clazz as class };
    export let b_value = '',
        placeholder = '',
        autofocus = false;

    let input: HTMLInputElement;
    onMount(() => {
        if (autofocus) input.focus();
    });

    const handleKey = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            dispatch('enter');
            event.preventDefault();
        }
    };

    const dispatch = createEventDispatcher<{ enter: void }>();
</script>

<!--
    @component
    Lets the user search for text
-->
<div
    class="input flex w-fit flex-row items-center px-3 transition-[border-radius] focus-within:bg-surface-100-800-token focus-within:rounded-xl focus-within:shadow-md {clazz}"
>
    <Fa icon={faMagnifyingGlass} class="text-surface-700-200-token" />
    <input
        class="border-none border-transparent bg-transparent pl-2 accent-transparent outline-none focus:border-transparent focus:ring-0"
        on:keydown={(event) => handleKey(event)}
        bind:value={b_value}
        bind:this={input}
        {placeholder}
    />
    {#if b_value}
        <button
            type="button"
            on:click={() => {
                b_value = '';
            }}
        >
            <Fa icon={faCircleX} class="text-surface-700-200-token" />
        </button>
    {/if}
</div>
