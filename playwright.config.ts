import { devices, type PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
	testDir: 'tests',
	testMatch: /(.+\.)?test.ts/,

	use: {
		ignoreHTTPSErrors: true,
		// baseURL: 'https://localhost:5173/', //  dev
		baseURL: 'http://localhost:4173/', // Port 4173 for optimized, no TSL
	},
	projects: [
		{
			name: 'Default Conf',
			use: {
				ignoreHTTPSErrors: true,
				...devices['iPhone 8'],
			},
		},
		/*
		{
			name: 'Mobile Chrome',
			use: {
				ignoreHTTPSErrors: true,
				...devices['Pixel 5'],
			},
		},
		*/
	],
}

export default config
