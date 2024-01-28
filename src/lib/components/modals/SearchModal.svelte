<script lang="ts">
    import Item from '$components/Item.svelte';
    import Loader from '$components/Loader.svelte';
    import SkeletonList from '$components/virtualList/SkeletonList.svelte';
    import { createEventDispatcher } from 'svelte';
    import ErrorFeedback from '../ErrorFeedback.svelte';
    import SearchBar from '../SearchBar.svelte';
    import VirtualList from '../virtualList/VirtualList.svelte';
    import Modal from './Modal.svelte';

    const MIN_HEIGHT = 200,
        MIN_WIDTH = 300;

    type T = $$Generic<Id>;
    const t = (item: any) => item as T; // eslint-disable-line @typescript-eslint/no-explicit-any

    export let b_open: boolean,
        target: HTMLButtonElement | undefined,
        data: (search: string) => Promise<T[]>,
        placeholder: string;

    let style = '',
        innerHeight: number,
        innerWidth: number,
        search: string,
        promise: Promise<T[]>;

    $: promise = data(search);

    $: {
        b_open;
        const rect = target?.getBoundingClientRect();
        if (rect) {
            let height;
            if (innerHeight - rect.top < MIN_HEIGHT) {
                height = MIN_HEIGHT;
            } else {
                // substract an offset so the search bar is positioned over the button
                height = innerHeight - rect.top - 6;
            }

            let left;
            if (innerWidth - rect.left < MIN_WIDTH) {
                left = innerWidth - MIN_WIDTH;
            } else {
                // shifting it to the left so the input is where the mouse is
                left = rect.left - 24;
            }

            style = `z-index: 20 !important; position: absolute !important; left: ${left}px !important; height: ${height}px !important; bottom: 0 !important`;
        }
    }
    const dispatch = createEventDispatcher<{ enter: T }>();

    const forwardEnter = async () => {
        const data = await promise;
        if (data.length === 0) return;
        dispatch('enter', data[0] as T);
    };
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<Modal bind:b_open {style} class="flex w-[23rem] flex-col gap-2">
    <SearchBar
        bind:b_value={search}
        class="mr-8"
        {placeholder}
        autofocus
        on:enter={forwardEnter}
    />
    {#await promise}
        <SkeletonList>
            <slot name="skeleton">
                <Item
                    class="h-8 flex-grow p-0"
                    style="width: {Math.random() * 5 +
                        12}rem; padding: 0 !important"
                >
                    <Loader />
                </Item>
            </slot>
        </SkeletonList>
    {:then data}
        <VirtualList
            {data}
            let:domIndex
            let:index
            let:row
            class="overflow-x-hidden"
        >
            <svelte:fragment slot="zeroColumn">
                <slot item={t(row)} {index} {domIndex} {search} />
            </svelte:fragment>
        </VirtualList>
    {:catch e}
        <ErrorFeedback {e} />
    {/await}
</Modal>
