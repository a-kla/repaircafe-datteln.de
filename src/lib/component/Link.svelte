<script lang="ts">
	import { building } from '$app/environment'
	import { page } from '$app/state'

	/** @component External Link -> use <a /> for internal links
	 *
	 *  `class="extrnal"` is set for global css targeting
	 *  because `summary[rel="external"]` can't be used
	 */

	
	interface Props {
		/** href without `https://`  */
		to: string;
		hreflang?: string | undefined;
		children?: import('svelte').Snippet;
	}

	const { to, hreflang = undefined, children }: Props = $props();
	//	export let rel: string | undefined = undefined

	async function checkLink(url: string, from: string) {
		console.log('link to', 'https://' + url, 'from', from)

		/* FIXME: no console output -> its not awaited while building and building finish before timeout? 
		const response = await fetch('https://' + url)
		if (!response.ok) {
			console.warn(`HTTP error! Status: ${response.status} @`, 'https://' + url, 'from', from)
		} else {
			console.log('… OK')
		}
		*/
	}
	// await checkLink(to, page.url.pathname);
	
</script>

<!-- ugly but can't use await in script block -->
{#if building}
	{#await checkLink(to, page.url.pathname)}
		<!-- output to console expected -->
	{/await}
{/if}
<a
	{hreflang}
	href="https://{to}"
	class="external"
	rel="external noindex"
	target="_blank">{@render children?.()}</a
>
