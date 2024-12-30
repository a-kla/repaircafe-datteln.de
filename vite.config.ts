import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import { enhancedImages } from '@sveltejs/enhanced-img'

// for server:{ https: true }
import path from 'node:path'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig(({ mode }) => ({
	test: {
		include: ['src/**/*.test.ts'],
		includeSource: ['src/**/*.{svelte,ts}'],
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
	],
}))
