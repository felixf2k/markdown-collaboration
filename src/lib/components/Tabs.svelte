<script lang="ts">
    import { activeTab, tabs } from '$stores/tabs';
    import { faX } from '@fortawesome/pro-solid-svg-icons';
    import Fa from 'svelte-fa';
</script>

<div class="flex grow flex-col">
    <div class="w-full flex flex-row items-center gap-2">
        {#each $tabs as tab (tab.id)}
            <div
                class="class text-lg h-fit flex flex-row items-center w-fit rounded-md {tab.id ===
                $activeTab?.id
                    ? 'variant-filled-primary'
                    : 'variant-soft-primary'}"
            >
                <button
                    type="button"
                    class="p-2 btn"
                    on:click={() => {
                        $activeTab = tab;
                    }}
                >
                    {tab.title}
                </button>
                <button
                    type="button"
                    class="h-8 w-8 flex items-center justify-center btn-icon"
                    on:click={() => {
                        tabs.close(tab.id);
                    }}
                >
                    <Fa icon={faX} />
                </button>
            </div>
        {/each}
    </div>
    <button
        on:click={() => {
            tabs.open({ id: crypto.randomUUID(), title: 'asdasd' });
        }}
    >
        addTab
    </button>
</div>
