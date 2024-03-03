<script lang="ts">
    import { sessionValue, storageValue } from '$stores/persistance';
    import { faChevronDown } from '@fortawesome/pro-light-svg-icons';
    import { onMount, setContext } from 'svelte';
    import Fa from 'svelte-fa';
    import Tree from '../tree/Tree.svelte';
    import type { TreeRow, TreeSearch } from '../tree/functions';
    import ColumnHead from './columnHead/ColumnHead.svelte';
    import {
        applySortings,
        type ColumnConfig,
        type RowExtention,
    } from './functions';

    type T = $$Generic<{ id: string } & RowExtention<T>>;
    const t = (item: any) => item as TreeRow<T & RowExtention<T>>; // eslint-disable-line @typescript-eslint/no-explicit-any
    type K = $$Generic<Record<string, ColumnConfig<T>>>;

    let clazz = '';
    export { clazz as class };

    export let data: T[] = [],
        columns: K,
        search: TreeSearch<T> | undefined = undefined,
        id: string,
        href: ((row: TreeRow<T & RowExtention<T>>) => string) | undefined =
            undefined;

    let columnIndexi = storageValue(
        id + '-columns',
        new Map(
            Object.entries(columns).map(([key, column], i) => [
                key,
                { width: column.width, index: i },
            ]),
        ),
        0,
        {
            save: (val) => Array.from(val),
            load: (val) =>
                new Map<string, { index: number; width: number }>(val),
        },
    );
    let sortings = sessionValue(id + '-table-sorting', []);

    $: sortedData = applySortings($sortings, data, columns);

    let gridStyle = '';

    setContext('table', { href });

    const setWidth =
        (column: string) =>
        ({ detail: width }: CustomEvent<number>) => {
            let parts = gridStyle.split(' ');
            const col = $columnIndexi.get(column);
            if (!col) return;
            parts[col.index + 2] = `${width}px`;
            gridStyle = parts.join(' ');
            $columnIndexi.set(column, { ...col, width: width });
            $columnIndexi = $columnIndexi;
        };

    const syncGridStyle = () => {
        let newGridStyle = 'grid-template-columns: fit-content(8px)';
        const cols = Array.from($columnIndexi).sort(
            ([_, a], [__, b]) => a.index - b.index,
        );
        for (const [key, { width }] of cols) {
            const columnDefinition = columns[key];
            if (!columnDefinition) continue;
            newGridStyle += ` ${width}px`;
        }
        gridStyle = newGridStyle;
    };

    const reorder =
        (target: string) =>
        ({
            detail: { position, source },
        }: CustomEvent<{ source: string; position: 'left' | 'right' }>) => {
            if (source === target) return;
            let sortedCols = Array.from($columnIndexi ?? new Map()).sort(
                ([_, a], [__, b]) => a.index - b.index,
            );
            const sourceIndex = sortedCols.findIndex(([v]) => v === source);
            const sourceElement = sortedCols[sourceIndex];
            // remove element that is being moved
            sortedCols = [
                ...sortedCols.slice(0, sourceIndex),
                ...sortedCols.slice(sourceIndex + 1),
            ];

            const targetIndex = sortedCols.findIndex(([v]) => v === target);
            // insert it back where we want
            const sideOffSet = position === 'right' ? 1 : 0;
            sortedCols = [
                ...sortedCols.slice(0, targetIndex + sideOffSet),
                sourceElement,
                ...sortedCols.slice(targetIndex + sideOffSet),
            ];

            sortedCols = sortedCols.map(([k, v], i) => [k, { ...v, index: i }]);
            $columnIndexi = new Map(sortedCols);
            syncGridStyle();
        };

    onMount(() => {
        syncGridStyle();
    });

    /** returns the style necessarry to position the div */
    $: style =
        (row: number, group?: string) =>
        (/** key of the column */ column: keyof K) => {
            let columnStyle: string;
            if (!$columnIndexi.has(column as string)) return 'display: none';
            if (group) {
                columnStyle =
                    group == column
                        ? `grid-column-start: 2; grid-column-end: ${
                              $columnIndexi.size + 2
                          } !important;`
                        : 'display: none !important;';
            } else {
                columnStyle = `grid-column-start: ${
                    // adding two to offset the zero column added by the list and to offset columns starting at 1
                    ($columnIndexi.get(column as string)?.index ?? 0) + 2
                };`;
            }

            return `${columnStyle} grid-row-start: ${
                row +
                3 /* add 1 to account for the header, 1 for the spacing row */
            }`;
        };
</script>

<Tree
    id={id + '-table'}
    data={sortedData}
    {gridStyle}
    {search}
    class="flex-grow overflow-hidden {clazz}"
    preScan={1}
    let:row
    let:index
    let:domIndex
    let:expanded
    let:toggleExpansion
>
    <svelte:fragment slot="head">
        <div
            class="bg-surface-50-900-token border-surface-300-600-token sticky top-0 col-start-1 row-start-1"
        />
        {#each Object.entries(columns).filter( ([c]) => $columnIndexi.has(c), ) as [columnKey, column]}
            <ColumnHead
                {columnKey}
                {column}
                {id}
                bind:b_sortings={$sortings}
                on:resize={setWidth(columnKey)}
                on:reorder={reorder(columnKey)}
                style="grid-column-start: 
                        {($columnIndexi.get(columnKey)?.index ?? 0) + 2}; 
                        grid-row-start: 1"
            />
        {/each}
    </svelte:fragment>
    <svelte:fragment slot="zeroColumn">
        {#each Array(t(row).nestingLevel) as _i}
            <div
                class="border-surface-900-50-token ml-2 h-full border-l pl-2"
            />
        {/each}
        {#if t(row).node.children && (t(row).node.children?.length ?? 0) > 0}
            <button
                type="button"
                class="bg-red flex h-full w-4 items-center justify-center"
                on:click={() => {
                    toggleExpansion(t(row).node.id);
                }}
            >
                <Fa
                    icon={faChevronDown}
                    class="transition-all {expanded.has(t(row).node.id)
                        ? ''
                        : '-rotate-90'}"
                />
            </button>
        {/if}
    </svelte:fragment>
    <svelte:fragment slot="action">
        {#if $sortings.length > 0}
            <button
                type="button"
                class="variant-ringed btn btn-sm"
                on:click={() => {
                    $sortings = [];
                }}
            >
                Sortierung entfernen
            </button>
        {/if}
    </svelte:fragment>
    <slot row={t(row)} getStyle={style(domIndex, t(row).node.group)} {index}>
        Row missing
    </slot>
</Tree>
