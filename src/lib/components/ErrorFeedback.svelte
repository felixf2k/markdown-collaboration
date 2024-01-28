<script lang="ts">
    export let e: App.Error;
</script>

<div class="flex flex-grow flex-col items-center justify-center text-error-500">
    {e.message}
</div>
