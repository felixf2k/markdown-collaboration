<script lang="ts">
    import { browser } from '$app/environment';
    import type { Id } from '$lib/api/index';
    import { onMount, tick } from 'svelte';

    type T = $$Generic<Id>;

    // props
    let clazz = '';
    export { clazz as class };
    export let data: T[],
        itemHeight: number | undefined = undefined,
        preScan = 0,
        gridStyle = 'grid-auto-columns: fit-content(20px)',
        rowStyle = '';

    // read-only, but visible to consumers via bind:start
    export let start = 0;
    export let end = 0;

    // local state
    let height_map: number[] = [],
        rows: HTMLCollectionOf<HTMLElement>,
        viewport: HTMLElement,
        contents: HTMLElement,
        viewport_height = 0,
        visible: { index: number; data: T }[] = [],
        mounted: boolean;

    let top = 0,
        bottom = 0,
        average_height: number,
        lastHandledScrollOffset = 0;

    $: visible =
        data.slice(start, end).map((data, i) => ({ index: i + start, data })) ??
        [];

    // whenever `items` changes, invalidate the current heightmap
    $: if (mounted) refresh(data, viewport_height, itemHeight);

    async function refresh(
        items: T[],
        viewport_height: number,
        itemHeight?: number,
    ) {
        if (!browser) return;
        const { scrollTop } = viewport;

        await tick(); // wait until the DOM is up to date

        // See if this has no problems, can't find any right now
        if (start >= items.length) {
            viewport.scrollTop =
                items.length * average_height - viewport_height;
            start = Math.floor(items.length - viewport_height / average_height);
            if (start < 0) start = 0;
        }

        let content_height = top - scrollTop;
        let i = start;

        while (content_height < viewport_height && i < items.length) {
            let row = rows[i - start];

            if (!row) {
                end = i + 1;
                await tick(); // render the newly visible row
                row = rows[i - start];
            }

            const row_height =
                (height_map[i] = itemHeight || row?.offsetHeight) || 40;
            content_height += row_height;
            i += 1;
        }

        end = i;

        const remaining = items.length - end;
        average_height = (top + content_height) / end;

        bottom = remaining * average_height;
        height_map.length = items.length;
        handle_scroll();
    }

    async function handle_scroll() {
        if (!browser || !viewport) return;
        const { scrollTop } = viewport;

        const old_start = start;

        for (let v = 0; v < rows.length; v += 1) {
            height_map[start + v] = itemHeight || rows[v].offsetHeight;
        }

        let i = 0;
        let y = 0;

        while (i < data.length) {
            const row_height = itemHeight || height_map[i] || average_height;
            if (
                y + row_height >
                scrollTop - preScan * (itemHeight || average_height)
            ) {
                start = i;
                top = y;

                break;
            }

            y += row_height;
            i += 1;
        }

        while (i < data.length) {
            y += height_map[i] || average_height;
            i += 1;

            if (
                y >
                scrollTop +
                    viewport_height +
                    preScan * (itemHeight || average_height)
            )
                break;
        }

        end = i;

        const remaining = data.length - end;
        average_height = y / end;

        while (i < data.length) height_map[i++] = average_height;
        bottom = remaining * average_height;

        // prevent jumping if we scrolled up into unknown territory
        if (start < old_start) {
            await tick();

            let expected_height = 0;
            let actual_height = 0;

            for (let i = start; i < old_start; i += 1) {
                if (rows[i - start]) {
                    expected_height += height_map[i];
                    actual_height += itemHeight || rows[i - start].offsetHeight;
                }
            }

            const d = actual_height - expected_height;
            viewport.scrollTo(viewport.scrollLeft, scrollTop + d);
        }

        // TODO if we overestimated the space these
        // rows would occupy we may need to add some
        // more. maybe we can just call handle_scroll again?
    }

    // lets call handle_scroll only when we have scrolled more than the height of a row
    // if we have rows that differ a lot in height we might have to add a weighting to the average_height i.e. 0.75
    const onScroll = () => {
        if (
            Math.abs(viewport.scrollTop - lastHandledScrollOffset) >
            average_height * 0.75
        ) {
            handle_scroll();
            lastHandledScrollOffset = viewport.scrollTop;
        }
    };

    // trigger initial refresh
    onMount(() => {
        rows = contents.getElementsByClassName(
            'virtual-list-row',
        ) as HTMLCollectionOf<HTMLTableRowElement>;
        mounted = true;
    });
</script>

<div
    bind:this={viewport}
    bind:offsetHeight={viewport_height}
    on:scroll={onScroll}
    class="virtual-list-viewport flex-grow {clazz}"
>
    <div bind:this={contents} class="content" style={gridStyle}>
        {#if mounted}
            <slot name="head" />
        {/if}
        <div class="col-start-1 row-start-2" style="height: {top}px" />
        {#each visible as row, i (row.data.id)}
            <div
                class="virtual-list-row items- col-start-1 flex w-fit flex-row flex-nowrap"
                style="grid-row-start: {i + 3}; {rowStyle}"
            >
                <slot name="zeroColumn" />
            </div>
            <slot row={row?.data} domIndex={i} index={row?.index ?? 0} />
        {/each}
        <div
            class="col-start-1"
            style="height: {bottom}px; grid-row-start: {visible.length + 3}"
        />
    </div>
</div>

<style>
    .virtual-list-viewport {
        position: relative;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        display: block;
    }

    .content {
        display: grid;
        row-gap: 0px;
    }
</style>
