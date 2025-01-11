<script lang="ts">
	import Md from '$lib/component/MD.svelte'

	import Menu from '../lib/component/Menu.svelte'

	import { page } from '$app/state'
	import { PUBLIC_SITE_CONTACT_ADDRESS, PUBLIC_SITE_NAME } from '$env/static/public'
	// import '../app.css'
	import '../app.postcss'
	interface Props {
		children?: import('svelte').Snippet
	}

	let { children }: Props = $props()

	import SvgLogo from '$lib/assets/images/RCD_Logo6.svelte'
	import { dev } from '$app/environment'
	import ThemeSwitcher from '$lib/component/ThemeSwitcher.svelte'
	import Link from '$lib/component/Link.svelte'

	const menuTop: Record<string, string> = {
		hausordnung: 'Hausordnung',
		faq: 'Fragen & Antworten',
	}

	const menuBottom: Record<string, string> = {
		impressum: 'Impressum',
		datenschutz: 'Datenschutz',
		apps: 'Tools',
	}

	//	https://www.facebook.com/RepairCafe.Datteln

	// import MdsvexContainer from "$lib/mdsvex/Container.svelte";
</script>

<header>
	<div class="s-container">
		<div>
			<ThemeSwitcher />
		</div>
		<nav class="wrap">
			<a
				class="svgLogo"
				href="/"
				aria-label="Startseite {PUBLIC_SITE_NAME}"
				aria-current={page.url.pathname == '/' ? 'page' : undefined}
			>
				<SvgLogo />
			</a>
			<Menu entries={menuTop} />
		</nav>
	</div>
</header>

<main class="s-container">
	{#if dev}
		<h1 class="devmode">Development Mode</h1>
	{/if}
	{@render children?.()}
</main>

<footer>
	<nav class="s-container">
		<Menu entries={menuBottom} />
		<Link to="github.com/a-kla/repaircafe-datteln.de">GitHub</Link>
	</nav>
	<address><Md pre={PUBLIC_SITE_CONTACT_ADDRESS} /></address>
</footer>

<style>
	.devmode {
		background: red;
	}

	header .s-container div {
		float: right;
		margin-block: 0.5rem;
	}

	nav {
		flex-grow: 9999;
	}

	[aria-current='page'] {
		border-bottom: 1px solid #EF694A;
	}
</style>
