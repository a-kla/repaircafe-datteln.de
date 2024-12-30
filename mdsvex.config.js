import { defineMDSveXConfig as defineConfig } from 'mdsvex'
import re_slug from 'rehype-slug'
import re_autolink from 'rehype-autolink-headings'
// import remarkToc from 'remark-toc'

import { enhancedImages } from 'mdsvex-enhanced-images'
import { defaultResolverFactory } from 'mdsvex-enhanced-images'


import remarkDirective from 'remark-directive'
// import remarkDirectiveRehype from 'remark-directive-rehype'
// import { visit } from 'unist-util-visit'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'

import customDirective from './src/lib/mdsvex/container.js'

import path, { join } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const path_to_layout = path.join(__dirname, './src/routes/md_layout.svelte')

const config = defineConfig({
	extensions: ['.svelte.md', '.md', '.svx'],

	smartypants: {
		dashes: 'oldschool',
	},

	layout: path_to_layout,

	remarkPlugins: [
		/**
		 * ⚠ don't update remarkDirective to ^3.0.0
		 * https://github.com/pngwn/MDsveX/issues/533#issuecomment-1890924889
		 *
		 * remarkFrontmatter, remarkParse => needed for remarkDirective
		 * */
		/*
		[enhancedImages,
			{
				resolve: defaultResolverFactory((path) =>
					join(__dirname, 'src', 'lib', 'assets', 'images', path)
				)
			}
		],
		*/
		enhancedImages,
		remarkFrontmatter,
		//		[remarkToc, {heading: 'Inhaltsverzeichnis (ToC)', parents: ['CustomContainer', 'root']}],
		remarkParse,
		remarkDirective,
		customDirective,
		//    remarkDirectiveRehype,
		remarkGfm
	],
	rehypePlugins: [re_slug, re_autolink] // for ToC and anchors

})

export default config
