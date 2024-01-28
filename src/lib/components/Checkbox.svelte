<script lang="ts">
    import { faCheck } from '@fortawesome/pro-solid-svg-icons';
    import Fa from 'svelte-fa';

    let clazz = '';
    export { clazz as class };
    export let checked: boolean | undefined = undefined,
        name = '',
        disabled = false;
</script>

<button
    type="button"
    id={name}
    {disabled}
    class="shrink-0 flex h-5 w-5 items-center justify-center rounded-md transition-all duration-200 {checked
        ? 'border-[0.625rem] border-primary-500'
        : 'border-4 border-surface-500'} {clazz}"
    on:click
>
    {#if checked}
        <div
            class="flex h-full w-full items-center justify-center text-sm text-white"
        >
            <Fa icon={faCheck} />
        </div>
    {/if}
</button>
