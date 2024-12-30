<script lang="ts">
	import Box from '../component/InfoBox.svelte'

	/**
	 *  In MD/*.svx files `:::foo[bar]{attri="baz"}` is transformed to
	 *   `<MdsvexContainer type="foo" label="bar" attributes="{attri:'baz'}" >…`
	 *
	 * FIXME: we can't use the {}-syntax in svx as it cant 
	 * 
	 * This Component implements the specific usage
	 */

	interface Props {
		type: 'info' | 'warn' | 'tip' | 'infoBox' | 'box' | 'card' | 'indent'
		//** Icon for Cards */
		label?: string | undefined
		/** JSON string */
		// attributes?: string | undefined
		children?: import('svelte').Snippet
	}

	const { type, label = undefined, children }: Props = $props()
</script>

{#if type == 'infoBox'}
	<!-- Svelte is confused by multiple `&::before` -->
	<Box {type} {label} {children}></Box>
{:else}
<div
class={type == 'card' ? 'box small' : type}
role={['info', 'warn', 'tip', 'infoBox'].includes(type) ? 'note' : null}
style={label ? `--emoji: '${label}'` : undefined}
>
<!-- can't use the {}-syntax in svx {...JSON.parse(attributes || '{}')} -->
		{@render children?.()}
	</div>
{/if}

<style>
	/* .indent => app.postcss */

	div {
		margin-bottom: calc(var(--sugar-spacing-block) * 1.5);
		padding: 1rem;
	}

	.box {
		/*		border: var(--sugar-border-width) outset var(--s-color-bg-85-fg); */
		border-radius: var(--s-block-radius);
		color: var(--s-color-text-article);
		background-color: var(--s-color-bg-article);
	}

	.box
/*	.info,
	.warn,
	.tip */
	{
/*
		:global(em) {
			color: var(--s-color-primary);
		}
*/
		:global(a) {
			color: var(--s-color-text-article);
		}
	}

	.small {
		margin-left: 3rem;
		max-width: fit-content;
	}

	/* NOT dark */
	@media not all and (prefers-color-scheme: dark) {
		.box {
			box-shadow: 0.5em 0.25em 0.5em #888;
		}
	}

	.info,
	.warn,
	.tip {
		padding-left: 3em;
		position: relative;

		&::before {
			font-size: 2em;
			width: 1.25em;
			font-variant: text;
			font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
			content: var(--emoji);

			display: flex;
			flex-wrap: wrap;
			align-content: center;
			justify-content: center;

			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
		}
	}

	.info {
		--emoji: 'ℹ️';
	}

	.warn {
		--emoji: '⚠️';
	}

	.tip {
		--emoji: '💡';
	}
</style>
