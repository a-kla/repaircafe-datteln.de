/* eslint-disable @typescript-eslint/no-require-imports */

// const autoprefixer = require('autoprefixer')

/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: [
		//		nested(),

		// require('at-rule-packer'),
		require('postcss-combine-duplicated-selectors'),
		// require('postcss-calc'),
		// require('postcss-var-optimize'),
		require('postcss-calc'),
		// require('postcss-var-optimize'),

		require('autoprefixer'),
	],
}

module.exports = config
