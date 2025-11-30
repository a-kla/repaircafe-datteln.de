import { describe, it, expect } from 'vitest'

// remove `.skip` to test vitest
describe.skip('Test floating point numbers', () => {
	it('has rounding issues', () => {
		// a obviously unnecessary test…
		expect(1 + 2).toBe(3)
		// Yet another obviously unnecessary test…
		expect(0.1 + 0.2).toBe(0.3) // or i'm wrong?
	})
})
