<script lang="ts">
	import { page } from '$app/state'

	interface Props {
		entries: Record<string, string>
	}

	const { entries }: Props = $props()
</script>

<menu>
	{#each Object.entries(entries) as [slug, title]}
		{@const path = '/' + slug + '/'}
		<li>
			<a href={path} aria-current={page.url.pathname == path ? 'page' : undefined}>{title}</a>
		</li>
	{/each}
</menu>

<style>
	[aria-current='page'] {
		border-bottom: 1px solid #ef694a;
	}
</style>
