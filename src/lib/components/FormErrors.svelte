<script lang="ts">
    type T = $$Generic;

    export let errors: string[] | Record<string, T> | undefined,
        fallbackMessage = 'Fehler';

    $: normalizedErrors = normalizeToStringArray(errors, fallbackMessage);

    function normalizeToStringArray<T>(
        val: string[] | Record<string, T> | undefined,
        fallbackMessage: string
    ): string[] {
        if (!val) {
            return [];
        } else if (Array.isArray(val)) {
            return val;
        } else if (val['_errors'] && Array.isArray(val['_errors'])) {
            return val['_errors'];
        } else {
            return [fallbackMessage];
        }
    }
</script>

{#if errors}
    {#each normalizedErrors as error}
        <small class="col-start-2 text-error-500">{error}</small>
    {/each}
{/if}
