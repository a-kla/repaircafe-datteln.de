import { mdsvex } from 'mdsvex'
import mdsvexConfig from './mdsvex.config.js'
import sequence from 'svelte-sequential-preprocessor'

// import adapter from '@sveltejs/adapter-auto'
import adapter from '@sveltejs/adapter-static'
// import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { sveltePreprocess } from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sequence([
		//		vitePreprocess(),
		sveltePreprocess({
			postcss: {
				configFilePath: './postcss.config.cjs',
			},
		}),
		mdsvex(mdsvexConfig),
	]),
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: false, // '404.html',
			precompress: false, // Github don't make use of it :'( https://github.com/orgs/community/discussions/21655
			strict: true,
		}),
		output: {
			bundleStrategy: 'split',
		}
	},
}

export default config
