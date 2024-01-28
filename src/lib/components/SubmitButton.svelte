<script lang="ts">
    import { SUCCESS } from '$lib/constants';
    import {
        faCheckCircle,
        faExclamationTriangle,
        faFloppyDisk,
        faLoader,
        faPen
    } from '@fortawesome/pro-light-svg-icons';
    import Fa from 'svelte-fa';

    let clazz = '';
    export { clazz as class };
    export let message: string | undefined = undefined,
        delayed = false,
        remove = false,
        b_disabled = false;

    // style according to props
    $: variant = (() => {
        if (b_disabled) return 'variant-filled-surface';
        if (message === SUCCESS) return 'variant-ghost-success';
        if (message) return 'variant-ghost-warning';
        if (remove) return 'variant-ghost-warning';
        return 'variant-filled-primary';
    })();
</script>

<button
    class="btn {variant} col-start-2 h-11 w-fit min-w-[5rem] gap-2 transition-all {clazz}"
    type={b_disabled ? 'button' : 'submit'}
    data-testid="submit-button"
    on:click={(event) => {
        if (!b_disabled) return;
        b_disabled = false;
        event.preventDefault();
    }}
    on:click
>
    {#if b_disabled}
        <slot name="edit">
            <Fa icon={faPen} />
            Bearbeiten
        </slot>
    {:else if delayed}
        <Fa icon={faLoader} class="h-6 w-6 animate-spin" />
    {:else if message === SUCCESS}
        <slot name="success">
            <Fa icon={faCheckCircle} />
            Gespeichert
        </slot>
    {:else if message}
        <!-- TODO: wie error message anzeigen? -->
        <Fa icon={faExclamationTriangle} />
        {message}
    {:else if remove}
        Löschen
    {:else}
        <slot name="submit">
            <Fa icon={faFloppyDisk} />
            Speichern
        </slot>
    {/if}
</button>
