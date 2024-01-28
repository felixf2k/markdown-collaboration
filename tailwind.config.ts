import { skeleton } from '@skeletonlabs/tw-plugin';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { Config } from 'tailwindcss';
import { appTheme } from './appTheme';

const config = {
    darkMode: 'class',
    content: ['./src/**/*.{html,js,svelte,ts}'],
    important: true,
    plugins: [forms, typography, skeleton({ themes: { custom: [appTheme] } })]
} satisfies Config;

export default config;
