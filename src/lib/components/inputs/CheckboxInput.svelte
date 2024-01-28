<script lang="ts">
    import Checkbox from '../Checkbox.svelte';
    import FormErrors from '../FormErrors.svelte';

    export let errors: string[] | undefined = undefined,
        id: string,
        label: string,
        title: string | undefined = undefined,
        b_value = false,
        disabled = false;
</script>

<!--
    @component
    Full input for a checkbox in a form, if you want just a checkbox use `Checkbox` component
-->
<div class="flex flex-col">
    <div class="flex flex-row items-center justify-start gap-2">
        <Checkbox
            checked={b_value}
            name={id}
            {disabled}
            on:click={() => {
                b_value = !b_value;
            }}
        />
        {#if label}
            <label
                for={id}
                class="label cursor-pointer transition-all {disabled
                    ? 'text-gray-400'
                    : ''}"
            >
                {label}
            </label>
        {/if}
    </div>
    <FormErrors {errors} />
</div>
