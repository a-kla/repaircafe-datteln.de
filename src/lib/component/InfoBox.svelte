<script lang="ts">
	/**
	 *  In MD/*.svx files `:::foo[bar]{attri="baz"}` is transformed to
	 *   `<MdsvexContainer type="foo" label="bar" attributes="{attri:'baz'}" >…`
	 *
	 * This Component implements the specific usage of type 'infoBox'
	 *
	 * Just necessary because of a Svelte Issue with multiple `&::before`
	 */

	interface Props {
		// for compatibility
		type: 'infoBox' | undefined
		//** Icon for Cards */
		label?: string | undefined
		/** JSON string */
		attributes?: string | undefined
		children?: import('svelte').Snippet
	}

	const { label: emoji = undefined, attributes, children }: Props = $props()
</script>

<div
	class="infoBox"
	{...JSON.parse(attributes || '{}')}
	role="note"
	style={`--emoji: '${emoji ? emoji : 'ℹ️'}'`}
>
	{@render children?.()}
</div>

<style>
	div {
		margin-bottom: calc(var(--sugar-spacing-block) * 1.5);
		padding: 1rem;
	}

	/*
	.info {
		--emoji: 'ℹ️';
	}

	.warn {
		--emoji: '⚠️';
	}

	.tip {
		--emoji: '💡';
	}
*/
	.infoBox {
		--color-emoji: var(--s-color-bg-article); /* fallback for light-dark() */
		--color-emoji-Bg: var(--s-color-primary);
		--color-Bg: var(--s-color-bg-article);

		border: none;
		border-left: 3em solid var(--color-emoji-Bg);
		padding: 0.5em 1em;
		color: var(--s-color-text-article);
		background-color: var(--s-color-bg-article);
		border-radius: 0.5em;

		box-shadow: 0.5em 0.25em 0.5em #888;

		:global(strong) {
			color: var(--s-color-primary);
		}

		:global(a) {
			color: var(--s-color-text-article);
		}

		&::before {
			display: inline-block;
			vertical-align: top;
			text-align: center;
			position: relative;
			font-size: 2em;
			left: -2em;
			margin-right: -1.5em;
			width: 1.5em;
			font-variant-emoji: text; /* uses text (mono-color) variant of emoji; not supported by chrome */
			font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';

			color: var(--color-emoji);
			font-style: normal;

			content: var(--emoji);
		}

		:global(:first-child) {
			display: inline-block;
		}
	}

	@media screen and (prefers-color-scheme: dark) {
		.infoBox {
		--color-emoji: var(--s-color-primary); /* fallback for light-dark() */
		--color-emoji-Bg: var(--s-color-bg-article);
		 box-shadow: none; /* 0.5em 0.25em 0.5em #888; */
		}
	}

	/*
	@supports (color: light-dark('#fff', '#000')) {
		.infoBox {
			--color-emoji: light-dark('#fff', '#000');
		}
	}
*/
</style>
