import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import { expect, test, } from 'vitest'

import component, { report } from './CashReport.svelte'
import { type ComponentProps } from 'svelte'

function somethingElse(): string {
	return '(any string from var or func)'
}

const padding = false;
const pad = (length: number) => padding ? ' ' + '_'.repeat(length) + '  ' : ':'

const template = report`
No real Placeholder ${somethingElse()}

Visitors: ${['visitors']}
Donations: ${['donations']} / ${['donationsAverage']} per Visitor
With Replacements: ${['donations', { '0.00 €': 'none' }]}${['donationsAverage', { undefined: '', other: ' ($X per Visitor)' }]}

Cash @ Start: ${['start']}
Cash @ End: ${['end']}
Final Cash including donations and outgoings: ${['final']}

revenue (End - Start + payouts): ${['revenue']}

payouts between Start & End:
${['payoutList']}
${['outgoList', { undefined: '(no outgoings)', other: 'outgoings after our end cash check:\n$X' }]}

We ${['+/-', { '-': 'lost! :(', other: 'earned' }]} this time (End - Start + donation): ${['+/-Sum']} (! outgoings excluded).
`

const props: ComponentProps<typeof component> = {
	cashStart: 10,
	cashEnd: 30,
	donations: 100,
	template: template,
}

const user = userEvent.setup()

test('CashReport ', async () => {
	render(component, props)
	const output = page.getByRole('status')
	const visitors = page.getByLabelText('Anzahl') // der Besucher
	const donations = page.getByLabelText('Spenden')
	const cashStart = page.getByLabelText('Kasse Anfang')
	const cashEnd = page.getByLabelText('Kasse Ende')
	const morePayouts = page.getByText('Weitere Entnahme')
	const moreOutgo = page.getByText('Weitere Ausgabe')

	await expect.element(output).toHaveTextContent('nicht alle nötigen Angaben vorhanden')

	await visitors.fill('30')

	/*
	Note: There is a non breaking space character before the €.
	On macOS (and some Linux) press Alt + Space for it. Or copy & pase this -> <-
	*/
	await expect.element(output).toHaveTextContent(`
No real Placeholder (any string from var or func)

Visitors: 30 Donations: 100,00 € / 3,33 € per Visitor
With Replacements: 100,00 € (3,33 € per Visitor)

Cash @ Start: 10,00 €
Cash @ End: 30,00 €
Final Cash including donations and outgoings: 130,00 € 

revenue (End - Start + payouts): 20,00 €

payouts between Start & End:
undefined
(no outgoings)
We earned this time (End - Start + donation): 120,00 € (! outgoings excluded).
`	)

	await morePayouts.fill('Payout 1') // new payout
	await user.tab()
	await user.keyboard('9.95') // 9,95 on browser with DE locale

	await expect.element(output).toHaveTextContent(`
No real Placeholder (any string from var or func)

Visitors: 30
Donations: 100,00 € / 3,33 € per Visitor
With Replacements: 100,00 € (3,33 € per Visitor)

Cash @ Start: 10,00 €
Cash @ End: 30,00 €
Final Cash including donations and outgoings: 130,00 €

revenue (End - Start + payouts): 29,95 €

payouts between Start & End:
  • Payout 1${pad(1)} 9,95 €

(no outgoings)

We earned this time (End - Start + donation): 120,00 € (! outgoings excluded).
`	)

	await donations.clear()
	await donations.fill('90')
	await moreOutgo.fill('Outgo 1')
	await user.tab()
	await user.keyboard('24')
	await moreOutgo.fill('Outgo 2 with longer Test')
	await user.tab()
	await user.keyboard('16.50')

	await expect.element(output).toHaveTextContent(`
No real Placeholder (any string from var or func)

Visitors: 30
Donations: 90,00 € / 3,00 € per Visitor
With Replacements: 90,00 € (3,00 € per Visitor)

Cash @ Start: 10,00 €
Cash @ End: 30,00 €
Final Cash including donations and outgoings: 79,50 €

revenue (End - Start + payouts): 29,95 €

payouts between Start & End:
  • Payout 1${pad(1)} 9,95 €

outgoings after our end cash check:
  • Outgo 1${pad(17)} 24,00 €
  • Outgo 2 with longer Test${pad(0)} 16,50 €
  (Insgesamt${pad(15)} 40,50 €)

We earned this time (End - Start + donation): 110,00 € (! outgoings excluded).
`	)

	
	render(component,{donations: 10, cashEnd: 0, cashStart: 50, visitors: 0, template: template})
	await expect.element(output).toHaveTextContent(`
No real Placeholder (any string from var or func)

Visitors: 0
Donations: 10,00 € / undefined per Visitor
With Replacements: 10,00 €

Cash @ Start: 50,00 €
Cash @ End: 0,00 €
Final Cash including donations and outgoings: -30,50 €

revenue (End - Start + payouts): -40,05 €

payouts between Start & End:
  • Payout 1${pad(1)} 9,95 €

outgoings after our end cash check:
  • Outgo 1${pad(17)} 24,00 €
  • Outgo 2 with longer Test${pad(0)} 16,50 €
  (Insgesamt${pad(15)} 40,50 €)

We lost! :( this time (End - Start + donation): -40,00 € (! outgoings excluded).
`	)
	
})

