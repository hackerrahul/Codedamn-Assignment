import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

import adapter from '@sveltejs/adapter-node';

const config = {
	kit: {
		adapter: adapter({ out: 'build' }),
	},
	preprocess: [vitePreprocess({})],
};

export default config;