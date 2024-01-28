<script lang="ts">
    import FormErrors from '$lib/components/FormErrors.svelte';

    export let errors: string[] | undefined = undefined,
        id: string,
        label: string | undefined = undefined,
        b_value: string | undefined,
        disabled = false,
        autofocus = false;
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
    <select bind:value={b_value}>
        <slot />
    </select>
    <FormErrors {errors} />
</div>
