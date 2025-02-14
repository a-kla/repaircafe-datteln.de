<script lang="ts">
	import Head from '$lib/component/Head.svelte'
	import type { PageData } from './$types'

    // const { allPDFs }: PageData = $props();
    export let data: PageData;
</script>
<Head title="Downloads" description="noindex" />

{#if data.allPDFs.length === 0}
    <p>Keine PDFs vorhanden.</p>
{:else}
    <h2>Kopier-Vorlagen</h2>
    <p>Diese Dokumente werden mit der Website als archivierbare PDFs generiert.</p>
    <p>Ob dieser Ansatz nun besser ist, als die „guten alten“ Office-Dokumente mit der aktuellen Version „irgendwo auf einem Stick oder online (Wie war nochmal das PW?)“, wird sich noch zeigen.</p>
    <p>
        Die Formulare sind (wie auch die alten Vorlagen) nur „Fake“ und
        können nicht interaktiv ausgefüllt werden.
    </p>

    <ul>
        {#each data.allPDFs as pdf}
            <li><a href={pdf.path}>{pdf.name}</a></li>
        {/each}
    </ul>
{/if}
