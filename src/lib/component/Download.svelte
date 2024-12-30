<script lang="ts">
	interface Props {
		url?: string
		text?: string
		filename: string
		type: fileExtension
		children?: import('svelte').Snippet
	}
	const { text, url, filename, type, children }: Props = $props()

	let err = $state('')

	/** @see https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types/Common_types */
	const mine = {
    'txt': 'text/plain',
    //    ;charset=utf-8',
    'csv': 'text/csv',
    'json': 'application/json',
	'ics': 'text/calendar'
} as const
type fileExtension = keyof typeof mine

	function asFile(
    data: BlobPart,
    filename: string,
    ext: fileExtension,
    binary = false
) {
    return new File([data], `${filename}.${ext}`, {
        type: binary ? 'octet/stream' : mine[ext],
 //       lastModified: new Date().getTime()
    })
}

const download = `${filename}.${type}`

const href = url || `data:${mine[type]},${encodeURIComponent(text || '')}`

</script>

<a {href} {download} role="button">
	{@render children?.()}
</a>
