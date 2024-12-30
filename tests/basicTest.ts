/** Basic Website Test
 * 
 * Tests:
 *  - links to sub-pages exist on the first ("home") page 
 *  - the sub-page has the expected Headline
 *  - sub-pages don't have critical Words (that may appear if something goes wrong)
 *    or the expected count of a word (or String) 
*/

import { expect, test, type Locator, type Page } from '@playwright/test'

export const defaultConfig: TestConfig = {
	// In most Cases this Words (or strings) are a clear sight that something don't work
	criticalStrings: [
		'404',
		'500',
		'error',

		'undefined',
		'object',
		'null',

		// improper Markdown render
		'::',
		'{',
		'*'
	] as const,// satisfies string[], // as const, // , ' :' falsely matches ':'?

	logLevel: 2,
}


type TestConfig = {
	/**
	In most Cases this Words (or strings) are a clear sight that something don't work.
	*/
	criticalStrings: ReadonlyArray<string>
	logLevel: 0 | 1 | 2 | 3
}

type SiteData = {
	url: string // 'https://localhost:5173/',
	name: string //'Repair Café Datteln',
	// Homepage main Headline (use name if undefined)
	hl?: string
	// is the navigation hidden behind a burger-menu on mobile devices?
	burgerNav: boolean
	countString?: PageData['countString']
}

type PageData = {
	slug: string
	// use slug if undefined
	linkText?: string
	// any Headline in the Content (use linkText if undefined)
	expectedHeadline?: string
	// ignored critical strings
	countString?: { [s: string]: number }
}


// any generic sights on the Page that something goes wrong?
const genericCheck = async (
	logLevel: TestConfig['logLevel'],
	page: Page,
	headline: string,
	wordCounts: [string, number][]
) => {
	// has the page the expected content?
	// Text changes over the Time but Headlines not that often
	await expect(page.getByRole('heading', { name: headline })).toBeVisible()

	wordCounts.forEach(
		async ([word, expectedCount]) => {
			if (logLevel > 1 && expectedCount > 0) {
				console.log(`counting '${word}' (${expectedCount} expected)`)
			} else if (logLevel > 2) console.log(`searching bad word '${word}'…`)

			await expect(page.getByText(word)).toHaveCount(expectedCount)
		}
	)
}


export function testWebsite(config: TestConfig = defaultConfig, site: SiteData, pages: PageData[]) {

	test('website', async ({ page, isMobile }) => {
		test.slow()
		await page.goto(site.url)

		const badWords = config.criticalStrings.reduce((o, key) => ({ ...o, [key]: 0 }), {})

		// The content of the Homepage may change but…
		// If we don't see the name of the Website on the Homepage
		// something is wrong for sure.
		expect(
			(await page.getByText(site.name).all()).find(
				(ele: Locator) => ele.isVisible()
			)
		).toBeDefined()


		await genericCheck(config.logLevel, page, site.hl || site.name, Object.entries(Object.assign({}, badWords, site.countString || {})))

		for (const pageData of pages) {
			// on mobile the Nav is behind a burger menu
			if (site.burgerNav && isMobile) {
				await page.getByLabel('Navigation').click()
			}

			const linkToPage = page.getByRole('link', { name: pageData.linkText || pageData.slug })
			await expect(linkToPage).toBeVisible()

			if (config.logLevel > 0) console.log('go to Page /'+ pageData.slug)
			await linkToPage.click()

			await page.waitForURL(`**/${pageData.slug}/`)
			await genericCheck(
				config.logLevel,
				page,
				pageData.expectedHeadline || pageData.linkText || pageData.slug,
				Object.entries(Object.assign({}, badWords, pageData.countString || {}))
			)
			await page.goBack()
		}
	})
}
