import {
	chromium,
	devices,
	firefox,
	test,
	webkit,
	type BrowserType
} from '@playwright/test'


/* import pjson from '../package.json' assert { type: 'json' }
const version = pjson.version
*/
// where to save the SS? 
const basePath = './tests/screenshots/'
	+ new Date().toLocaleString('sv-SE',
		{
			dateStyle: 'short',
			timeStyle: 'medium'
		}).replaceAll(/[\s/]/g, '_')

const pages = [
	'/',
	'/impressum/',
	'/datenschutz/',
	'/faq/',
	'/hausordnung/',
]

const makeSS = async (
	deviceName: string,
	browserType: BrowserType,
	color: "light" | "dark" | "no-preference" = 'no-preference'
) => {
	const browser = await browserType.launch()

	const device = devices[deviceName]
	// .NewContextOptions().setColorScheme(ColorScheme.DARK))
	const context =
		await browser.newContext({ ...device, colorScheme: color })
	const page = await context.newPage()

	const deviceNameSanitized = deviceName.replaceAll(/[\s/]/g, '_')
	for (const url of pages) {
		await page.goto(url, {
			waitUntil: 'networkidle'
		})

		const title = (await page.title()).replaceAll(/[\s/]/g, '_')
		// console.log(title);
		/* `path: unsupported mime type "null"` => invalid URL but goto() did not throw? */
		await page.screenshot({
			path: `${basePath}/${title}_${deviceNameSanitized}.png`,
			fullPage: true
		})
	}

	await browser.close()
}

test.describe.configure({ mode: 'parallel' });
test.describe('Make Screenshots',
	async () => {
		// test.describe.configure({ mode: 'parallel' })
		test('on "iPhone" (Light mode)', async () => {
			await makeSS('iPhone 8', webkit, 'light')
		})

		test('on Tablet (Dark mode)', async () => {
			await makeSS('Galaxy Tab S4 landscape', chromium, 'dark')
		})

		test('on Desktop (Firefox)', async () => {
			await makeSS('Desktop Firefox', firefox)
		})

	}
)

