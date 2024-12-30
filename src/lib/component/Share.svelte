<script lang="ts">
	interface Props {
		data: {
			url?: string
			text?: string
		}
		children?: import('svelte').Snippet
	}
	let { data, children }: Props = $props()

	let err = $state('')
</script>

{#if navigator.canShare}
	<button
		onclick={async () => {
			if (navigator.canShare(data)) {
				try {
					await navigator.share(data)
				} catch (e: unknown) {
					err = `Fehler: ${(e as Error).message}`
				}
			}
		}}
		>{#if err}
			{err}
		{:else}
			{@render children?.()}
		{/if}
	</button>
{/if}