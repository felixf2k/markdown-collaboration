<script lang="ts">
    let clazz = '';
    export { clazz as class };
    export let disabled = false,
        active = false,
        /** If set the resulting html will be an anchor*/
        href: string | undefined = undefined,
        style = '';
</script>

<!--
    @component
    Represents selected nodes (e.g. catalog points, tenants or categories)
-->
{#if $$slots.icon}
    <svelte:element
        this={href ? 'a' : 'button'}
        class="flex max-w-full flex-row items-center gap-1 {clazz}"
        {style}
        {disabled}
        {href}
        type={!href ? 'button' : undefined}
        on:click
    >
        {#if !disabled}
            <slot name="icon" />
        {/if}
        <div
            class="{active
                ? 'border-primary-500'
                : 'border-transparent'} bg-surface-200-700-token flex flex-row items-center gap-1 whitespace-nowrap rounded-xl border p-1.5 shadow-md duration-200 hover:bg-surface-100-800-token hover:rounded-md hover:shadow-lg"
        >
            <slot />
            <slot name="action" />
        </div>
    </svelte:element>
{:else}
    <svelte:element
        this={href ? 'a' : 'button'}
        class="{clazz} {active
            ? 'border-primary-500'
            : 'border-transparent'} bg-surface-200-700-token flex max-w-full flex-row items-center gap-1 overflow-hidden whitespace-nowrap rounded-xl border p-1.5 shadow-md duration-200 hover:bg-surface-100-800-token hover:rounded-md hover:shadow-lg"
        {style}
        {disabled}
        {href}
        type={!href ? 'button' : undefined}
        on:click
    >
        <slot />
        <slot name="action" />
    </svelte:element>
{/if}
