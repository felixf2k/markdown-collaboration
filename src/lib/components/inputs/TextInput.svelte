<script lang="ts">
    import FormErrors from '$lib/components/FormErrors.svelte';
    import { onMount } from 'svelte';

    export let errors: string[] | undefined = undefined,
        id: string,
        label: string | undefined = undefined,
        b_value: string | undefined,
        disabled = false,
        autofocus = false;

    let input: HTMLInputElement;

    onMount(() => {
        if (autofocus) input.focus();
    });
</script>

<!--
    @component
    Lets the user put in short texts like titles or names
-->
<div class="flex flex-col">
    {#if label}
        <label for={id} class="label w-full pt-2.5">
            {label}
        </label>
    {/if}
    <input
        {id}
        bind:this={input}
        type="text"
        class="input transition-[border-radius] disabled:opacity-100 {errors
            ? 'input-error'
            : 'text-surface-900-50-token'}"
        bind:value={b_value}
        {disabled}
    />
    <FormErrors {errors} />
</div>
