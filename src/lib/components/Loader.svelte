<script lang="ts">
    let clazz = '';
    export { clazz as class };
</script>

<div class="loader h-full w-full {clazz}">
    <div class="h-full w-full flex-grow" />
</div>

<style lang="scss">
    .loader {
        background-size: 200% 200%;
        background-image: repeating-linear-gradient(
            -45deg,
            rgb(var(--color-surface-200)) 20%,
            rgb(var(--color-surface-300)) 35%,
            rgb(var(--color-surface-200)) 50%
        );
        animation: diagonal alternate 3s infinite;
    }

    :global(.dark) {
        .loader {
            background-image: repeating-linear-gradient(
                -45deg,
                rgb(var(--color-surface-700)) 20%,
                rgb(var(--color-surface-600)) 35%,
                rgb(var(--color-surface-700)) 50%
            );
        }
    }

    @keyframes diagonal {
        0% {
            background-position: 0% 50%;
        }
        100% {
            background-position: 100% 50%;
        }
    }
</style>
