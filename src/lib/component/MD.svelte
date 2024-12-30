<script lang="ts">
	import { mdBlock, mdInline, mdPre } from '$lib/markdown'

	interface Props {
		block?: string,
		inline?: string,
		pre?: string,
	}

	const { block, inline, pre }: Props = $props()
	const html = block ? mdBlock([block]) : pre? mdPre([pre]) : mdInline([inline ?? '{}'])
</script>
{@html html.code}
