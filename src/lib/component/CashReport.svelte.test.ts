// @vitest-environment jsdom
// happy-dom don't work proper
import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
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

const {rerender} = render(component, props)

const user = userEvent.setup()

test('CashReport ', async () => {
	const report = () => screen.getByRole<HTMLOutputElement>('status').textContent

	expect(report()).toContain('nicht alle nötigen Angaben vorhanden')

	await user.type(screen.getByLabelText('Anzahl'), '30') // der Besucher

	// console.log(report());
	/* eslint no-irregular-whitespace: ["error", { "skipTemplates": true, "skipComments": true }] */
	/*
	Note: There is a non breaking space character before the €.
	On macOS (and some Linux) press Alt + Space for it. Or copy & pase this -> <-
	*/
	expect(report()).toEqual(`
No real Placeholder (any string from var or func)

Visitors: 30
Donations: 100,00 € / 3,33 € per Visitor
With Replacements: 100,00 € (3,33 € per Visitor)

Cash @ Start: 10,00 €
Cash @ End: 30,00 €
Final Cash including donations and outgoings: 130,00 €

revenue (End - Start + payouts): 20,00 €

payouts between Start & End:
undefined
(no outgoings)

We earned this time (End - Start + donation): 120,00 € (! outgoings excluded).
`	)

	await user.type(screen.getByLabelText('Weitere Entnahme'), 'Payout 1') // new payout
	await user.tab()
	await user.keyboard('9.95') // 9,95 on real browser with DE locale

	expect(report()).toEqual(`
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

	await user.clear(screen.getByLabelText(/Spenden/))
	await user.type(screen.getByLabelText(/Spenden/), '90')
	await user.type(screen.getByLabelText(/Weitere Ausgabe/), 'Outgo 1')
	await user.tab()
	await user.keyboard('24')
	await user.type(screen.getByLabelText(/Weitere Ausgabe/), 'Outgo 2 with longer Test')
	await user.tab()
	await user.keyboard('16.50')

	expect(report()).toEqual(`
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

	await rerender({donations: 10, cashEnd: 0, cashStart: 50, visitors: 0})
	expect(report()).toEqual(`
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

