<script lang="ts">
	import Link from "$lib/component/Link.svelte"

    interface Props {
        href: string;
        rel?: string|undefined;
        children?: import('svelte').Snippet;
    }

    const { href, rel = undefined, children }: Props = $props();

    const external = href.startsWith('http') ? href.replace(/^https?\:\/\//, '') : false 

</script>

{#if external}
<Link to={external}>{@render children?.()}</Link>
{:else}
<a {href} {rel}>{@render children?.()}</a>
{/if}
