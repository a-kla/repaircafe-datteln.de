import { it } from "vitest"

/** Fix (dirty): JS rounding errors on currency input/outputs
 *
 * `0.1 + 0.2` is for JS `0.30000000000000004`
 * This resolve ours resulting issues, but not all in general!
 * See and run tests below.
 *
 * May use currency.js? */
export const fixRoundingError = (eur: number, digits = 2) => {
	const rounded = Math.round(eur * 10 ** digits) / 10 ** digits
	return Object.is(rounded, -0) ? 0 : rounded
}

if (import.meta.vitest) {
	const { describe, test, expect } = import.meta.vitest
	const x = -1
	/* if x < 0 the result of x * 0 is -0 but displayed as 0,
		a waste of time debugging this! */
	const debugHint = (result: number) => Object.is(result, -0) ? ' 👿 Haha have fun debugging this!' : ''

	describe.each([
		{ calc: '-0.1 + -0.2 + 0.3', expectedResult: 0 },
		{ calc: '0.1 + 0.2', expectedResult: 0.3 },
		{ calc: '0.1 + 0.7', expectedResult: (1 + 7) / 10 },
		{ calc: 'x * 0', expectedResult: 0 },
	])("JS Math Pitfall %$", ({ calc, expectedResult: expectedResult }) => {
		const result = eval(calc)

		test.fails(`You expect ${calc} = ${expectedResult} but JS calculates ${result}${debugHint(result)}`, () => {
			expect(calc).toBe(expectedResult)
		})

		it('is fixed with fixRoundingError()', () => {
			expect(fixRoundingError(result)).toBe(expectedResult)
		})
	})

	describe('fixRoundingError() ', () => {
		test.each([
			{ input: 0.999, result: 1 },
			{ input: 0.995, result: 1 },
			{ input: 1.004, result: 1 },
			{ input: 0.994, result: 0.99 },
			{ input: -0.994, result: -0.99 },
			{ input: 1 / 3, result: 0.33 },
			{ input: 0.005, result: 0.01 },
			{ input: -0.00499999, result: 0 },
			{ input: -0.0050001, result: -0.01 },
			{ input: -1.004, result: -1 },
		])('rounds $input to $result (€)', ({ input, result }) => {
			expect(fixRoundingError(input)).toBe(result)
		})

		test.each([
			{ input: 0.999, result: 0.999 },
			{ input: 0.995, result: 0.995 },
			{ input: 1.004, result: 1.004 },
			{ input: 0.994, result: 0.994 },
			{ input: -0.994, result: -0.994 },
			{ input: 1 / 3, result: 0.333 },
			{ input: 0.005, result: 0.005 },
			{ input: -0.00499999, result: -0.005 },
			{ input: -0.005001, result: -0.005 },
			{ input: -1.004, result: -1.004 },
		])('rounds $input to $result (3 digits)', ({ input, result }) => {
			expect(fixRoundingError(input, 3)).toBe(result)
		})
	})

	describe.todo('fixRoundingError() known issues', () => {
		test.each([
			// it is wrong but OK as we only expect inputs with 2 decimal places
			{ input: -0.005, validResult: -0.01 },
			{ input: -0.045, validResult: -0.05 },
		])('rounds $input NOT to $validResult', ({ input, validResult }) => {
			expect(fixRoundingError(input)).toBe(validResult)
		})
	})
}
