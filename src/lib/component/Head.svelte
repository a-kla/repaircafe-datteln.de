<script lang="ts">
	interface Props {
		title: string
		description: 'noindex' | string

		meta?: {
			[key: string]: string
		}
	}

    import { PUBLIC_SITE_NAME } from "$env/static/public";

	const { title, description, meta }: Props = $props()

	const headTitle = title === 'none' ? PUBLIC_SITE_NAME : title + ' - ' + PUBLIC_SITE_NAME
</script>

<svelte:head>
	<title>{headTitle}</title>
	{#if description == 'noindex'}
		<meta name="robots" content="noindex" />
	{:else}
		<meta name="description" content={description} />
	{/if}
	{#if meta}
		{#each Object.entries(meta) as [name, content]}
			<meta {name} {content} />
		{/each}
	{/if}
</svelte:head>

{#if title !== 'none'}
	<h1>{title}</h1>
{/if}
