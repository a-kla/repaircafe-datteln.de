<script lang="ts">
	interface Props {
		class?: string,
		text: string,
		children?: import('svelte').Snippet
	}
	let { text, class: classes = "", children }: Props = $props()

	let ok: boolean | undefined = $state()
</script>

<button
	onclick={async () => {
		try {
			await navigator.clipboard.writeText(text)
            ok = true
		} catch (e) {
            ok = false
			throw e
		}
	}}
    class={classes}
	disabled={text ? undefined : true}
	>{@render children?.()}
    {#if ok} ✔{/if}{#if ok===false} ❌{/if}
</button>

<style>
</style>