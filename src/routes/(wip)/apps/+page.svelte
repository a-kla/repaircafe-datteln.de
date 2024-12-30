<script lang="ts">
	import CashReport, { report } from '$lib/component/CashReport.svelte'
	import CashCheck from '$lib/component/CashCheck.svelte'
	import Head from '$lib/component/Head.svelte'
	import Md from '$lib/component/MD.svelte'

	let cashStart: number | undefined = $state()
	let cashEnd: number | undefined = $state()
	let donations: number | undefined = $state()

	const now = new Date()
	const monthNamesDE = [
		'Januar',
		'Februar',
		'März',
		'April',
		'Mai',
		'Juni',
		'Juli',
		'August',
		'September',
		'Oktober',
		'November',
		'Dezember',
	] as const

	const template = report`Liebe Mitglieder des Repair-Cafés,
hier der Kassen-Bericht für ${monthNamesDE[now.getMonth()]} ${now.getFullYear().toString()}:

Unser aktueller Bar-Kassenbestand ist ${['final']}.

Wir hatten bei dem letzten Repair-Café ${['visitors']} Besucher,
diese haben ${['donations']} gespendet, somit im Durchschnitt ${['donationsAverage']}.

Gestartet waren wir mit ${['start']} in der Kasse.

Während des Repair-Café hatten wir ${['payoutList', { undefined: 'keine Entnahmen!?', other: "folgende Entnahmen:\n$X" }]}

Nach dem Repair-Café hatten wir ${['end']} in der Kasse,
also durch dem Kuchenverkauf ${['revenue']} umgesetzt. 

Mit Berücksichtigung der Spenden hatten wir ein ${['+/-', { '-': 'Verlust', other: 'Zugewinn' }]} von ${['+/-Sum']}.
${['outgoList', { undefined: '', other: '\nNach dem „Kassensturz“ hatten wir noch folgende Ausgaben:\n$X' }]}
`

	/*
	import SvgBar from './SvgBar.svelte'

	import type { PageData } from './$types';
	export let data: PageData;
    */
</script>

<Head title="Mini-Apps" description="Kleine Tools -nicht nur- für unser Repair Café" />

<Md block="
Diese kleinen Helfer könnten bei Bedarf auch an andere Repair Cafés angepasst werden…
" />
<noscript>
	Tut mir leid, ohne JavaScript funktioniert es nicht…
</noscript>

<CashCheck
	actionButtons={{
		'Start Geld': [
			(sum) => {
				cashStart = sum
			},
			cashStart != undefined,
		],
		'Am Ende': [
			(sum) => {
				cashEnd = sum
			},
			cashEnd != undefined,
		],
		Spenden: [
			(sum) => {
				donations = sum
			},
			donations != undefined,
		],
	}}
></CashCheck>

<CashReport
	{cashStart}
	{cashEnd}
	{donations}
	payout={['für Kuchen', 'an die Caritas für Getränke und Miete']}
	outgo={['für Getränke bei der Nachbesprechung', 'für eine Einzahlung auf das Sparbuch']}
	{template}
/>
