<script module lang="ts">
	type Euro = number | undefined
	type Placeholder =
		| string
		| [
				placeholder:
					| 'start'
					| 'payoutSum'
					| 'payoutList'
					| 'end'
					| 'revenue'
					| 'visitors'
					| 'donations'
					| 'donationsAverage'
					| '+/-'
					| '+/-Sum'
					| 'outgoSum'
					| 'outgoList'
					| 'final',
				replacements?: { other: string; [value: string]: string } | { [value: string]: string },
		  ]

	interface Props {
		cashStart?: Euro
		cashEnd?: Euro
		donations?: Euro
		visitors?: number | undefined
		/** DE: Entnahmen während des RC */
		payout?: ReadonlyArray<string>
		/** DE: Ausgaben nach dem Kassensturz */
		outgo?: ReadonlyArray<string>
		template: [template: ReadonlyArray<string>, placeholders: Array<Placeholder>]
	}

	export type ItemList = [string, Euro][]

	/**
	 * Helps to write readable templates
	 * @use
	 * ```
	 *     template={report`Our Cash at the begin: ${['start']}…`}
	 * ```
	 *  @see *test.ts for examples
	 */
	export function report(
		template: ReadonlyArray<string>,
		...placeholders: [...Placeholder[]]
	): Props['template'] {
		return [template, placeholders]
	}
</script>

<script lang="ts">
	import { tick } from 'svelte'
	import Copy from './Copy.svelte'
	import Share from './Share.svelte'

	let {
		cashStart = $bindable(undefined),
		cashEnd = $bindable(undefined),
		donations = $bindable(undefined),
		visitors = $bindable(undefined),
		payout: payoutLabels = [],
		outgo: outgoLabels = [],
		template,
	}: Props = $props()

	const payout = $state(payoutLabels.map((label) => [label, undefined]) satisfies ItemList)
	const outgo = $state(outgoLabels.map((label) => [label, undefined])) satisfies ItemList
	let payoutLabelNew = $state('')
	let outgoLabelNew = $state('')

	const euro = (eur: number) => eur.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })

	const getValue = (placeholder: Placeholder[0]): string => {
		const sum = (list: ItemList) => {
			let sum = 0
			for (const [label, value] of list) {
				if (value != null && label.length > 0) {
					sum += value
				}
			}
			return sum
		}

		switch (placeholder) {
			case 'visitors':
				return visitors?.toString() || 'undefined'
			case 'donations':
				return donations != undefined ? euro(donations) : 'undefined'
			case 'start':
				return cashStart != undefined ? euro(cashStart) : 'undefined'
			case 'end':
				return cashEnd != undefined ? euro(cashEnd) : 'undefined'

			case 'donationsAverage':
				return donations != undefined && visitors ? euro(donations / visitors) : 'undefined'
			case '+/-':
				return (
					cashEnd != undefined && cashStart != undefined && donations != undefined ?
						cashEnd + donations < cashStart ?
							'-'
						:	'+'
					:	'undefined'
				)
			case '+/-Sum':
				return cashEnd != undefined && cashStart != undefined && donations != undefined ?
						euro(cashEnd + donations - cashStart)
					:	'undefined'
			case 'revenue':
				const payoutSum = sum(payout)
				return cashEnd != undefined && cashStart != undefined ?
						euro(cashEnd - cashStart + payoutSum)
					:	'undefined'
			case 'final':
				const outgoSum = sum(outgo)
				return cashEnd != undefined && donations != undefined ?
						euro(cashEnd + donations - outgoSum)
					:	'undefined'

			case 'outgoList':
				return formatList(outgo)
			case 'payoutList':
				return formatList(payout)

			case 'payoutSum':
				return euro(sum(payout))
			case 'outgoSum':
				return euro(sum(outgo))

			default:
				return `[Unknown Placeholder: ${placeholder}]`
		}
	}

	const output = $derived.by(() => {
		if (
			donations === undefined ||
			visitors === undefined ||
			cashStart === undefined ||
			cashEnd === undefined
		) {
			return 'Es sind nicht alle nötigen Angaben vorhanden.'
		}
		/* for readability, variables used in the template */
		outgo
		payout

		return interpolateTemplate(template[0], template[1])
	})

	function interpolateTemplate(strings: ReadonlyArray<string>, placeholders: Placeholder[]) {
		if (placeholders.length == 0) return strings[0]

		let template = ''
		for (let index = 0; index < strings.length; index++) {
			template += strings[index]

			const placeholder = placeholders.at(index)
			if (placeholder) {
				if (typeof placeholder == 'string') {
					/* placeholder was a const or handled outside this component */
					template += placeholder
				} else {
					const value = getValue(placeholder[0])

					if (placeholder[1]) {
						/*
							replace the value by the given string
							or `$X` by the value in the 'other' string
						 */
						template +=
							value in placeholder[1] ? placeholder[1][value]
							: placeholder[1]['other'] ? placeholder[1]['other'].replace(/\$X/, value)
							: value
					} else {
						template += value
					}
				}
			}
		}

		return template
	}

	const formatList = (list: ItemList): string => {
		const noPadding = true

		let out = ''
		let sum = 0
		let counter = 0

		let lengthLeft = 9 // 'Insgesamt'.length
		const lengthRight = 9 //  '-123,45 €'.length

		const pad = (start: string, end: string) =>
			noPadding ? `${start}: ${end}` :
			(start + ' ').padEnd(lengthLeft, '_') + ' ' + end.padStart(lengthRight, ' ')

		for (const [label, value] of list) {
			if (value != null && label.length > 0)
				if (label.length > lengthLeft) lengthLeft = label.length
		}
		++lengthLeft // for +' '

		for (const [label, value] of list) {
			if (value != null && label.length > 0) {
				++counter
				sum += value
				out += '  • ' + pad(label, euro(value)) +'\n'
			}
		}

		if (counter == 0) {
			return 'undefined'
		}

		if (counter > 1) {
			out += '  (' + pad('Insgesamt', euro(sum)) + ')'
		}

		return out
	}

	/*
async function getNewFileHandle() {
  const opts = {
    types: [
      {
        description: "Text file",
        accept: { "text/plain": [".txt"] },
      },
    ],
  }
  return await window.showSaveFilePicker(opts)
}
*/
</script>

<article>
	<header>Kassenbericht</header>
	<form onsubmit={(e) => e.preventDefault()}>
		<div class="grid reportBottom">
			<fieldset class="grid reportBottom1">
				<legend>Entnahmen beim RC</legend>
				{#each payout as [label, val], i}
					<input type="text" bind:value={payout[i][0]} maxlength="50" id={'payoutLabel' + i} aria-label={`Entnahmen Posten ${i + 1}`}/>
					<input
						aria-label={`€ Wert`}
						type="number"
						bind:value={payout[i][1]}
						step="0.01"
						required={label.length == 0 ? undefined : true}
						disabled={label.length == 0}
						id={i + 1 == payout.length ? 'payoutValueLast' : 'payoutValue' + i}
					/>
				{/each}
				<label>
					Weitere Entnahme
					<input
						type="text"
						maxlength="50"
						bind:value={payoutLabelNew}
						id="payoutLabelNew"
						onblur={async () => {
							if (payoutLabelNew.length > 0) {
								payout.push([payoutLabelNew, undefined])
								payoutLabelNew = ''
								await tick()
								document.getElementById('payoutValueLast')?.focus()
							}
						}}
					/>
				</label>
				<label
					>€
					<input type="number" step="0.01" disabled required />
				</label>
			</fieldset>
			<div class="grid reportTop">
				<fieldset class="grid reportTop1">
					<legend>Besucher</legend>
					<label>Anzahl<input type="number" bind:value={visitors} required min="0" /></label>
				</fieldset>
				<fieldset class="grid reportTop2">
					<legend>Bargeld</legend>
					<label>
						Vor dem RC
						<input type="number" bind:value={cashStart} required step="0.01" />
					</label>
					<label>
						Nach dem RC
						<input type="number" bind:value={cashEnd} required step="0.01" />
					</label>
					<label>
						Spenden Box
						<input type="number" bind:value={donations} required step="0.01" />
					</label>
				</fieldset>
			</div>
			<fieldset class="grid reportBottom2">
				<legend>Ausgaben NACH dem Kassensturz</legend>
				{#each outgo as [label, val], i}
					<input type="text" bind:value={outgo[i][0]} maxlength="50" id={'outgoLabel' + i} />

					<input
						type="number"
						bind:value={outgo[i][1]}
						step="0.01"
						min="-1000"
						inputmode="decimal"
						required={label.length == 0 ? undefined : true}
						disabled={label.length == 0}
						id={i + 1 == outgo.length ? 'outgoValueLast' : 'outgoValue' + i}
					/>
				{/each}
				<label
					>Weitere Ausgabe (bzw. Einzahlung bei negativem Wert)
					<input
						type="text"
						maxlength="50"
						bind:value={outgoLabelNew}
						id="outgoLabelNew"
						onblur={async () => {
							if (outgoLabelNew.length > 0) {
								outgo.push([outgoLabelNew, undefined])
								outgoLabelNew = ''
								await tick()
								document.getElementById('outgoValueLast')?.focus()
							}
						}}
					/></label
				>
				<label>€<input type="number" step="0.01" disabled /></label>
			</fieldset>
		</div>
	</form>
	<p class="flex row">
		<Copy text={output}>Bericht Kopieren</Copy>
		<Share data={{text: output}}>teilen</Share>
	</p>
	<footer>
		<output>{output}</output>
		<!-- Todo: Workaround for Samsung Keyboards?: Button "insert '-'" -->
	</footer>
</article>

<!-- SvgBar
	data={{
		Einnahmen: [
			{ label: 'Kuchen', euro: 200, color: 'green' },
			{ label: 'Spenden', euro: donations || 0, color: 'lime' }
		],
		Ausgaben: [
			{ label: 'Kuchen', euro: 500, color: 'red' },
			{ label: 'caritas', euro: 150, color: 'orange' }
		]
	}}
/ -->

<style>

	output {
		white-space: pre-wrap;
		font-family: 'Courier New', Courier, monospace;
	}

	input:invalid {
		background-color: #ffdddd;
		color: #000;
	}
	input:disabled {
		background-color: #ddd;
		color: #333;
	}

	legend {
		/* Fix sugar css*/
		line-height: var(--legend-height);
		padding-top: 0.25rem;
	}

	label {
		color: #000;
	}

	form {
		container: form / inline-size;
		width: 100%;
	}

	.grid {
		display: grid;
		justify-items: center;
		align-items: end;
		gap: 0.25rem;
	}

	.reportTop,
	.reportBottom {
		grid-template-columns: 1fr;
	}

	.reportTop2 {
		grid-template-columns: 1fr 1fr 1fr;
	}
	.reportBottom1,
	.reportBottom2 {
		grid-template-columns: 1fr 5rem;
	}

	@container form (width > 30rem) {
		.reportTop {
			grid-template-columns: 1fr 3fr;
		}
		.reportBottom {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
