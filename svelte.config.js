import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
        // If your environment is not supported or you settled on a specific environment, switch out the adapter.
        // See https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter: adapter(),
        alias: {
            $components: 'src/lib/components',
            $stores: 'src/lib/stores',
            $functions: 'src/lib/functions',
            $db: 'src/lib/server/mongo',
        },
    },
    onwarn: (warning, handler) => {
        if (
            warning.code.startsWith('a11y') ||
            warning.code.startsWith('svelte(a11y')
        )
            return;
        handler(warning);
    },
};

export default config;
