import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import { expect, test, } from 'vitest'

import component from './CashCheck.svelte'
import { untrack, type ComponentProps } from 'svelte'

let stateSum = $state(0)
const props: ComponentProps<typeof component> = {
	actionButtons: {
		Test: [
			(sum) => {
				stateSum = sum || -Infinity
			},
			false,
		],
	},
}


test('CashCheck using counter Inputs', async () => {
	render(component, props)

	const output =  page.getByRole('status')
	// <input type=number> elements for note/coin counters
	const numInputs = page.getByRole('spinbutton')
	const resetButton = page.getByText('Reset')
	
	await expect.element(output).toHaveTextContent('0,00 €')

	/* first counter should be for 50 € notes */
	await numInputs.first().fill('1').then(async () => {await userEvent.tab()} /* blur the input to start the calculation */)
	await expect.element(output).toHaveTextContent('50,00 €')

	/* the counter for 20 € notes should be selected, we enter '2' and blur */
	await userEvent.keyboard('2')
	await userEvent.tab()
	/* 1 x 50 € + 2 x 20 € = 90 € */
	await expect.element(output).toHaveTextContent('90,00 €')

	/* 
	the forth input is for the manual amount entry
	we simulate a mistake by entering an invalid value (and overwriting the calculated 40 €)
	*/
	await numInputs.nth(3).fill('3').then(async () => {await userEvent.tab()})
	await expect.element(numInputs.nth(3)).toBeInvalid()
	await expect.element(output).toHaveTextContent('53,00 €')


	// Reset and try again
	await resetButton.click()
	await expect.element(output).toHaveTextContent('0,00 €')
	await expect.element(numInputs.first()).toHaveValue(null)
	await expect.element(numInputs.nth(3)).toBeValid()
	await numInputs.first().click()

	for (let i = 0; i < 4; i++) {
		await userEvent.keyboard((i + 1).toString())
		await userEvent.tab()
	}
	/* 1x50 + 2x20 + 3x10 + 4x5 = 140 € */
	await expect.element(output).toHaveTextContent('140,00 €')

	/* Now we enter the coins by entering values in the last 8 inputs */
	/* 140 € + 5x2€ + 6x1€ + 7x0.50€ + 8x0.20€ + 9x0.10€ + 10x0.05€ + 11x0.02€ + 12x0.01€
	   = 140 € + 10 € + 6 € + 3.50 € + 1.60 € + 0.90 € + 0.50 € + 0.22 € + 0.12 €
	   = 162,84 €
	*/
	await numInputs.nth(9).click()
	await userEvent.keyboard('10') // 5x2€
	await userEvent.tab()
	await userEvent.keyboard('6') // 6x1€
	await userEvent.tab()
	await userEvent.keyboard('3.5') // 7x0.50€
	await userEvent.tab()
	await userEvent.keyboard('1.6') // 8x0.20€
	await userEvent.tab()
	await userEvent.keyboard('0.9') // 9x0.10€
	await userEvent.tab()
	await userEvent.keyboard('.5') // 10x0.05€
	await userEvent.tab()
	await userEvent.keyboard('.22') // 11x0.02€
	await userEvent.tab()
	await userEvent.keyboard('.12') // 12x0.01€
	await userEvent.tab()
	await expect.element(output).toHaveTextContent('162,84 €')

	// Finally we test the action button
	const actionButton = page.getByRole('button', { name: 'Test' })
	await actionButton.click()
	expect(untrack(() => stateSum)).toBe(162.84);

})
