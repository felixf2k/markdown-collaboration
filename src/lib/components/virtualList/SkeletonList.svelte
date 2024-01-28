<script lang="ts">
    import Loader from '$components/Loader.svelte';

    // props
    let clazz = '';
    export { clazz as class };
    export let amount = 10;
</script>

<div class="flex flex-col gap-2 overflow-hidden {clazz}">
    {#each Array(amount) as _}
        <slot>
            <div
                class="h-11 flex-shrink-0 overflow-hidden rounded-lg"
                style="width: {Math.random() * 25 + 50}%"
            >
                <Loader />
            </div>
        </slot>
    {/each}
</div>
