<script module>
	import A from '$lib/mdsvex/A.svelte';
	export { A as a };
</script>

<script>
	import Head from "$lib/component/Head.svelte"

	/**  lang="ts" => error in svelte.config.js?
	 /*
	 /* this Layout is used by MDsveX
	 /* don't import any other MDsveX files here.
	 **/

	/**
	 * @typedef {Object} Props
	 * @property {string} title
	 * @property {string} description
	 * @property {Object.<string, string>} [meta]
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { title, description, meta, children } = $props();
	//	data // from mdsvex
	//	form // from mdsvex

	//	console.log(form, data);

	if (!title) {
		console.warn('No title: in frontmatter');
	}

	if (!description) {
		console.warn('No description: in frontmatter');
	}
</script>

<!-- Nav / -->

<Head {title} {description} {meta}/>

{@render children?.()}
