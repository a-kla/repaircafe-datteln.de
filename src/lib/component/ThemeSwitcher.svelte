<script lang="ts">
	import { onMount } from 'svelte'
	const defaultTheme = 'light'
	import { set_theme, get_system_theme, use_stored_theme } from './ThemeSwitcher'
	import { building } from '$app/environment'

	let selected = $state('')
	let system = $state('')

	const themes = [
		[
			'',
			'System',
			() => system == 'light' ? '☀' : '🌜',
			() => set_theme(undefined, defaultTheme),
			() => system == 'light' ? 's-light' : 's-dark',
		],
		['light', 'Hell', '☀', () => set_theme('light', defaultTheme), 's-light'],
		['dark', 'Dunkel', '🌜', () => set_theme('dark', defaultTheme), 's-dark'],
	] as const

	onMount(
		() => {
			selected = sessionStorage.getItem('forceScheme') || ''
			system = get_system_theme(defaultTheme)
			use_stored_theme(defaultTheme)

		}
	)
</script>

<!-- make the scripts available in csr=false mode 
<svelte:head>
{@html
	`<script>
		${theme.get_system_theme}
		${theme.switch_theme_rules}
		${theme.set_theme}
		${theme.use_stored_theme}

		let currentTheme;
		document.onreadystatechange = () => {
	
			if (document.readyState == "complete") {
				currentTheme = use_stored_theme('${defaultTheme}');
			}
		}
	</script>`
}
</svelte:head>
-->
<div class={{hidden: building /* don't show if JS disabled */}}>
	<article style="color-scheme: dark">
		<details>
			<summary><span aria-label="Farbmodus">🎨</span> </summary>
			<menu>
				{#each themes as [value, desc, icon, onclick, classes]}
					<li class={typeof classes == 'function' ? classes() : classes }>
						<label>
							<input type="radio" name="colorScheme" {onclick} bind:group={selected} {value} />
							<span>
								{desc} 
							</span>
							<span>
								{typeof icon == 'function' ? icon() : icon}
							</span>
						</label>

						<!--
{@html `<button onclick="${fn}"  ${i == 1 ? ' aria-current' : ''}">${icon} ${desc}</button>`}
-->
					</li>
				{/each}
			</menu>
		</details>
	</article>
</div>

<style>
	.hidden {
		display: none;
	}

	div {
		position: relative;
		min-width: 6rem;
		min-height: 3rem;
	}
	article {
		position: absolute;
		right: 0;
		top: 0;
	}

	summary {
		width: max-content;
	}

	details[open] {
		display: inline-block;
		margin-block: auto;

		summary [aria-label]::after {
			content: ' ' attr(aria-label) / /* alt for Screenreader: */ "";
		}
	}

	menu {
		margin-block: 0;
		margin-inline: auto;
		width: max-content;
	}

	label {
		justify-content: space-between;
	}

	li {
		margin-block: .5rem;
		background-color: var(--s-color-bg);
		padding: .5rem;
		border-radius: var(--s-block-radius);
    border: var(--sugar-border-width) solid var(--s-color-bg-85-fg);

	}
</style>
