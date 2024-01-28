<script lang="ts">
    export let b_value: boolean;
    let clazz = '';
    export { clazz as class };
</script>

<button
    class="h-6 w-12 rounded-full {b_value
        ? 'bg-primary-500'
        : 'bg-gray-500'} {clazz}"
    type="button"
    on:click={() => {
        b_value = !b_value;
    }}
    on:click
>
    <div
        class="relative h-4 w-4 rounded-full bg-white transition-all {b_value
            ? 'left-7'
            : 'left-1'}"
        data-testid="indicator"
    />
</button>
