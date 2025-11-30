import { sveltekit } from '@sveltejs/kit/vite'
import { enhancedImages } from '@sveltejs/enhanced-img'

// for server:{ https: true }
import path from 'node:path'
import mkcert from 'vite-plugin-mkcert'

import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		enhancedImages(),
		sveltekit(), 
		mkcert({
			savePath: path.resolve(process.cwd(), 'node_modules/.mkcert'),
			hosts: ['localhost', '127.0.0.1', '192.168.178.20'],
		}),
	],

	test: {
		projects: [
			{
				// Client-side tests (Svelte components)
				extends: true,
				test: {
					name: 'client',
					// Timeout for browser tests - prevent hanging on element lookups
					testTimeout: 2000,
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [
							// { browser: 'chromium' },
							{ browser: 'firefox' },
							// { browser: 'webkit' },
						],
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: [
						'src/lib/server/**',
						'src/**/*.ssr.{test,spec}.{js,ts}',
					],
					includeSource: ['src/**/*.{svelte,ts}'],
					setupFiles: ['./src/vitest-setup-client.ts'],
				},
			},
			{
				// SSR tests (Server-side rendering)
				extends: true,
				test: {
					name: 'ssr',
					environment: 'node',
					include: ['src/**/*.ssr.{test,spec}.{js,ts}'],
				},
			},
			{
				// Server-side tests (Node.js utilities)
				extends: true,
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: [
						'src/**/*.svelte.{test,spec}.{js,ts}',
						'src/**/*.ssr.{test,spec}.{js,ts}'
					],
				},
			},
		],
		coverage: {
			include: ['src'],
			// Improved performance: Vitest only checks files in src/
			// instead of scanning the entire project
		},
	},
});


/** @type {import('vite').UserConfig} 
export default defineConfig(({ mode }) => ({

	test: {
		include: ['src/** /*.test.ts'],
		includeSource: ['src/** /*.{svelte,ts}'],
		environment: 'jsdom',
	},
	server: {
		https: {},
		proxy: {},
	},
	resolve: {
		conditions: mode === 'test' ? ['browser'] : [],
	},
	output:{
		experimentalMinChunkSize: 1024,
	},
	plugins: [
		enhancedImages(),
		sveltekit(),
		mkcert({
			savePath: path.resolve(process.cwd(), 'node_modules/.mkcert'),
			hosts: ['localhost', '127.0.0.1', '192.168.178.20'],
		}),
	] as any[], // TODO: fix type issue
}))
*/