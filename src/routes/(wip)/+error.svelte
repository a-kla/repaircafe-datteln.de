<script lang="ts">
    /**
     * ! Not used as fallback see: https://github.com/sveltejs/kit/issues/10007
     */
	import { page } from '$app/state'
	import { PUBLIC_WEBMASTER_MAIL } from '$env/static/public'
</script>

<h1>Etwas stimmt nicht!</h1>

{#if page.status !== 404}
    <h2>
        Fehlercode: {page.status} 
    </h2>
    <p>Bitte wenden Sie sich bei erneutem Auftreten des Fehlers an: {PUBLIC_WEBMASTER_MAIL}  </p>
{:else}
    <p>Die Seite existiert leider nicht (mehr).</p>
{/if}