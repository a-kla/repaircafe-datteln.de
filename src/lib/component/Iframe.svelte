<script lang="ts">
	import { customRender } from '$lib/markdown'

	interface Props {
		width: string
		height: string
		title: string
		markdown: string
		/** allow-scripts & allow-same-origin = !!! security risk !!! */
		sandbox?: string | undefined
	}
	const { width, height, title, markdown, sandbox = '' }: Props = $props()

	const srcdoc = `<!DOCTYPE html>
  <html lang="de" style="display:table;height:100%;width:100%">
    <head>
      <meta charset="utf-8">
    </head>
    <body style="display:table-cell;text-align:center;vertical-align:middle;padding:1em">
    ${customRender(markdown, {})}
    </body>
  </html>`

	// const src = `data:text/html;charset=utf-8,${srcdoc}`
</script>

<iframe {title} {sandbox} {width} {height} {srcdoc}></iframe>

<style>
  iframe {
    width: 100%;
    max-width: 100%;
	border: 3px inset var(--s-color-primary);
	height: revert-layer;
}
</style>