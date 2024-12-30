/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
	useTabs: true,
	singleQuote: true,
	semi: false,
	experimentalTernaries: true,
	trailingComma: 'all',
	printWidth: 100,
	plugins: ['prettier-plugin-svelte'],
	overrides: [
		{ files: '*.svelte', options: { parser: 'svelte' } },
		{
			"files": "*.json5",
			"options": {
				"singleQuote": false,
				"quoteProps": "preserve",
				"trailingComma": "none",
				"parser": "json5"
			}
		}
	],
	svelteStrictMode: true,
}

export default config
