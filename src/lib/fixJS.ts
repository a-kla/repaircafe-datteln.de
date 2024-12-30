/** Fix (dirty): JS rounding errors on currency input/outputs
 *
 * `0.1 + 0.2` is for JS `0.30000000000000004`
 * This resolve ours resulting issues, but not all in general!
 * See tests below.
 *
 * May use currency.js? */
export const fixRoundingError = (eur: number) => {
	const rounded = Math.round(eur * 100) / 100
	return Object.is(rounded, -0) ? 0 : rounded
}

if (import.meta.vitest) {
	const { describe, it, expect } = import.meta.vitest

	describe.each([
		// some JS Pitfalls
		{ calc: -1 * 0, result: 0 }, // it is -0 but may displayed as 0
		{ calc: 0.1 + 0.2, result: 0.3 },
		{ calc: 0.1 + 0.7, result: (1 + 7) / 10 },
		{ calc: -0.1 + -0.2 + 0.3, result: 0 },
	])("Don't trust floating point numbers", ({ calc, result }) => {
		it.fails(`You expect (${result}) but the result is ${calc}`, () => {
			expect(calc).toBe(result)
		})

		it('works with fixRoundingError()')
		expect(fixRoundingError(calc)).toBe(result)
	})

	describe('fixRoundingError() and more then 2 decimal places', () => {
		it.each([
			{ input: 0.999, result: 1 },
			{ input: 0.995, result: 1 },
			{ input: 1.004, result: 1 },
			{ input: 0.994, result: 0.99 },
			{ input: 0.994, result: 0.99 },
			{ input: 1 / 3, result: 0.33 },
			{ input: 0.005, result: 0.01 },
			{ input: -0.00499999, result: 0 },
			{ input: -0.0050001, result: -0.01 },
			{ input: -1.004, result: -1 },
		])('rounds $input to $result (€)', ({ input, result }) => {
			expect(fixRoundingError(input)).toBe(result)
		})
	})

	describe.todo('fixRoundingError() known issues', () => {
		it.each([
			// it is wrong but OK as we only expect inputs with 2 decimal places
			{ input: -0.005, validResult: -0.01 },
			{ input: -0.045, validResult: -0.05 },
		])('rounds $input NOT to $validResult', ({ input, validResult }) => {
			expect(fixRoundingError(input)).toBe(validResult)
		})
	})
}
