<script lang="ts">
    import { sessionValue } from '$stores/persistance';
    import { faChevronDown } from '@fortawesome/pro-light-svg-icons';
    import { onMount, setContext } from 'svelte';
    import Fa from 'svelte-fa';
    import VirtualList from '../virtualList/VirtualList.svelte';
    import {
        expandToSearched,
        getAllIds,
        summarizeByString,
        treeWalker,
        type TreeSearch,
    } from './functions';

    type TreeItem = $$Generic<{ children?: T[]; id: string }>;

    // props
    let clazz = '';
    export { clazz as class };
    export let data: TreeItem[] = [],
        /** Determines whether tree is expanded initally*/
        defaultExpanded = false,
        /** What the tree is searched for*/
        search: TreeSearch<TreeItem> | undefined = undefined,
        /** Which item has to be visible initially */
        initalyExpandedTo: string | undefined = undefined,
        /** How many items should be rendered in front of and behind the visible items */
        preScan = 0,
        /** The style of the grid that is created for the tree, used to e.g. set explicit columns*/
        gridStyle = '',
        id: string;

    /** for internal use only, can be accessed via bind:firstSearchMatch */
    export let firstSearchMatch: TreeItem | undefined = undefined;

    // internal state
    let prevSearchString: string | undefined = '',
        expanded = sessionValue(id + '-tree-expansion', new Set<string>()),
        preSearchExpanded = new Set<string>(),
        hidden = new Set<string>(),
        allIds: string[] = [];

    setContext('tree', { toggleExpansion });

    $: {
        if (search) {
            if (search.value !== prevSearchString) {
                // save / load the expansion state before the search
                if (search.value && !prevSearchString) {
                    preSearchExpanded = $expanded;
                } else if (!search.value && preSearchExpanded) {
                    $expanded = preSearchExpanded;
                    hidden = new Set();
                }

                // mutate the tree based on the search
                if (search.value) {
                    const {
                        hidden: newHidden,
                        expanded: newExpanded,
                        firstMatch,
                    } = summarizeByString(
                        data,
                        search.value,
                        search.getNodeText,
                    );

                    $expanded = newExpanded;
                    hidden = newHidden;
                    firstSearchMatch = firstMatch;
                }
            }
            prevSearchString = search.value;
        }
    }

    $: treeData = treeWalker(data, $expanded, hidden);
    $: allIds = data.flatMap(getAllIds);

    onMount(() => {
        const hasStoredExpanded = Array.from($expanded).length !== 0;
        if (defaultExpanded && !hasStoredExpanded) {
            $expanded = new Set(allIds);
        } else if (initalyExpandedTo) {
            $expanded = expandToSearched(initalyExpandedTo, data);
        }
        if (search && !hasStoredExpanded) {
            prevSearchString = '';
            search.value = search.value;
        }
    });

    function toggleExpansion(id: string) {
        if ($expanded.has(id)) {
            $expanded.delete(id);
        } else {
            $expanded.add(id);
        }
        $expanded = $expanded;
    }

    const expandAll = () => {
        $expanded = new Set(allIds);
    };

    const collapseAll = () => {
        $expanded.clear();
        $expanded = $expanded;
    };
</script>

<div class="flex flex-col {clazz}">
    {#if treeData.someHaveChildren}
        <div class="flex flex-row gap-1">
            <button
                type="button"
                class="variant-ringed btn btn-sm"
                on:click={expandAll}
            >
                <Fa icon={faChevronDown} />
            </button>
            <button
                type="button"
                class="variant-ringed btn btn-sm"
                on:click={collapseAll}
            >
                <Fa icon={faChevronDown} class="rotate-180" />
            </button>
            <slot name="action" />
        </div>
    {/if}
    <VirtualList
        data={treeData.entries}
        {preScan}
        {gridStyle}
        let:row
        let:index
        let:domIndex
    >
        <slot name="head" slot="head" />
        <slot name="zeroColumn" slot="zeroColumn" />
        <slot {row} {toggleExpansion} expanded={$expanded} {index} {domIndex} />
    </VirtualList>
</div>
