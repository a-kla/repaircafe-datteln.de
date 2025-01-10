<script lang="ts">
	import { PUBLIC_REPO } from '$env/static/public'
	import Head from '$lib/component/Head.svelte'
	import Md from '$lib/component/MD.svelte'
	import Container from '$lib/mdsvex/Container.svelte'

	type FaqEntries = Record<string, string>

/** [Question: mdInline]: Answer: mdBlock */
const faq_Rc: FaqEntries = {
	'Wann und wo ist das Repair Café?':
		`Das Repair Café Datteln findet *in der Regel am **1. Samstag** im Monat* von 14:00 bis 17:00 Uhr im *Westring 8* statt.
		
		Details finden Sie auf unserer [Startseite](/).`,

	'Muss ich mich vorher anmelden?':
		'Nein, das ist bei uns nicht nötig.',

	'Was kann im Repair Café Datteln repariert werden?':
		`Bei uns werden hauptsächlich Elektro- und Haushaltsgeräte repariert.
		Wir helfen aber auch bei der Reparatur von Computern, Spielzeug, Uhren, Textilien und vieles mehr.`,

	'Was sollte man **nicht** zum Repair Café bringen?':
		` - Sperrige oder sehr schwere Sachen.
		 - mögliche Garantie-Fälle. \
		Die Garantie erlischt meistens bei dem Versuch einer Selbstreparatur. Daher sollten Sie sich zuerst an Ihren Händler oder den Hersteller wenden.
		 - Dinge, deren „Reparatur“ Sie nicht selbst durchführen wollen und Dienstleistungen von professionellen Anbietern entsprechen. Etwa Hosen, die gekürzt werden sollen.`,

	'Kann mein Festnetz-Telefon bei euch repariert werden?':
		`Vielleicht, aber wir können es danach nicht testen.
		Eventuell müssen nur Einstellungen geändert oder die Akkus eines Mobilteils getauscht werden. Solche Fälle übernimmt auch das Team von *Anti-Rost* bei Ihnen Zuhause. (siehe nächste Frage)`,

	'Kann mal Jemand kurz vorbeikommen und etwas reparieren?':
		`*Ja*, unsere Kollegen von den Initiativen **Anti-Rost**.

		Anti-Rost bietet Kleinstreparaturen im Haushalt an, die auch von Familienangehörigen
		oder Nachbarn erledigt werden könnten und die so geringfügig sind, dass man dafür keinen
		Handwerksbetrieb beauftragen kann und deren Erledigung in der Regel nicht länger als eine Stunde in
		Anspruch nimmt.

		*[Anti-Rost OstVest](https://www.caritas-ostvest.de/anti-rost-ostvest.html)* (Datteln, Waltrop, Oer-Erkenschwick)

		*[Anti-Rost Recklinghausen](https://anti-rost-re.de/)*`,

	'Könnt Ihr meinen Laptop / PC mit Windows XP / 7 reparieren?':
		`Ob eine Reparatur möglich ist, hängt von der Art des Defekts ab.

		*Wir empfehlen jedoch unabhängig von der Reparatur* einen Wechsel zu Windows 10 / 11 oder Linux. Denn Windows 8 und ältere Versionen werden schon lange **nicht mehr mit Sicherheits-Updates versorgt**.
		Auch Windows 10 wird ab Oktober 2025 nicht mehr mit kostenlosen Sicherheits-Updates versorgt.

		Auch wenn Sie glauben *„Macht nix, da ist nichts Wichtiges darauf.”*, sollten Sie bedenken dass ein unsicheres System als *Ausgangspunkt für weitere Angriffe* missbraucht werden kann. Angriffe auf kritische Infrastruktur als Teil eines „Botnetz” oder auf andere Computer und „smarte” Geräte in Ihrem Haushalt.

		*Wir führen jedoch kein Upgrade auf Windows 11 **für Sie*** durch. Denn dafür gibt es zahlreiche professionelle Dienstleister, denen das Repair Café keine Konkurrenz machen möchte.

		Auch sind leider viele Geräte angeblich zu alt für Windows 11. \
		Doch diese Geräte kann man *mit Linux weiter nutzen*. 

		Sie können gerne bei uns im Repair-Café **Linux auf Ihrem Gerät testen** (sofern unser „Fachmann” anwesend ist).`,

	'Kann ich etwas abgeben und „bei Gelegenheit“ abholen?':
		'Nein. Wir sind nur an den angegebenen Terminen vor Ort und haben keine Lagerkapazitäten. Zudem sieht das Konzept „Repair Café” vor dass Sie nach Möglichkeit bei der Reparatur anwesend sind und mithelfen.',

	'Was kann ich machen, wenn ich an dem Samstag nicht kann?':
		`Falls Sie nicht zu unserem nächsten Termin kommen können, haben Sie auch die Möglichkeit sich an ein anderes Repair Café zu wenden.

		Die Repair Cafés in [Recklinghausen](https://www.altstadtschmiede.de)
		und [Castrop-Rauxel](https://www.repaircafe-castroprauxel.de/) finden am 2. Samstag im Monat statt.
		In [Walltrop](https://www.facebook.com/RCWaltrop) gibt es gar 2 Cafés: eins am *2. Freitag* und eins am letzten Samstag im Monat. (Stand der Info: 2023-06)`,

	'Seid Ihr wirklich kostenlos?':
		`Wir stellen unser Wissen, Werkzeuge und unsere Freizeit kostenlos zur Verfügung. Wir hoffen jedoch auf eine kleine Spende.

		Neue Materialien und Ersatzteile wie Elektrizitätskabel, Stecker, Sicherungen usw. sind nicht kostenlos und müssen gesondert bezahlt oder beschafft werden.

		Außerdem müssen natürlich Kuchen und Getränke bezahlt werden.`,

	'Wo finde ich weitere Informationen?':
		`Allgemeine Informationen zu den Repair Cafés weltweit
		finden Sie auf der Webseite <https://repaircafe.org/de/>.`,
}

const faq_website: FaqEntries = {
/*	'Warum sieht die Website überall unterschiedlich aus?':
		`Auf unterschiedlichen Geräten kann und soll unsere Website unterschiedlich aussehen.

		Bei der Erstellung der Website wurde bewusst auf eine fest vorgegebene Schriftart und -größe verzichtet. Dies reduziert die Ladezeit der Website und bietet Ihnen mehr Flexibilität. In einigen Browsern können Sie die Standard-Schrift frei wählen, andere Browser orientiren sich an den Schrift-Einstellungen Ihres Smartphones.

		Zudem verwenden wir die „Emojis“ ihres Systems bzw. Browsers statt einheitliche Grafiken. Dies reduziert ebenfalls die Ladezeit und bietet Ihnen eventuell vertraute Symbole. Für uns ist es aber auch schlicht weniger Aufwand ein Emoji auszuwählen als eine passende lizenzfreie Grafik zu suchen oder zu erstellen. Emojis sind allerdings sehr von der verwendeten Software abhängig. Manche Emojis werden nur als leere Kästchen angezeigt, weil sie der Software nicht bekannt sind. Dies kommt besonders auf älteren und Linux Geräten vor. Auf unserer Website finden wir es akzeptabel.

		Zudem gibt es 2 unterschiedliche Designs für den Tag- bzw. Nachtmodus.
		Die Website passt sich darüber hinaus an die Größe des Bildschirms anpassen.

		All dies lässt die Website nicht nur auf jedem Gerät, sondern auch in unterschiedlichen Apps auf dem selbem Gerät etwas anders erscheinen.`,
*/

	'Wo kann ich mich über Fehler beschweren?':
		`Bei Problemen mit der Website, Fehler in den Texten oder wenn Sie Anregungen haben,
		können Sie eine Mail an <website@repaircafe-datteln.de> schreiben.
		Oder mit uns beim Repair Café reden.
		
		Falls Sie Github kennen, können Sie auch gerne direkt ein
		[„Issue” auf Github](${PUBLIC_REPO}issues) oder „Pull-Request“ erstellen.`,

	'Ist die Website Open-Source?':

		`Es gibt einen [öffentlichen Code-Repository](${PUBLIC_REPO}) auf Github.
		Dieser enthält nicht nur Code von mir sondern alles was Notwendig ist um diese Seite zu erstellen, inklusive fremder Inhalte.
		Daher: ***Ja, aber** es darf nicht einfach alles frei kopiert werden.*
		`,


	'Womit wurde die Seite erstellt?':
		`Mit [SvelteKit](https://www.svelte.dev) (Svelte 5, TypeScript), Markdown (hauptsächlich [MDsveX](https://mdsvex.com/)), VS Code als IDE und viele anderen Open-Source-Projekten.`,
}

</script>

<Head title="Fragen und Antworten" description="Fragen und Antworten zum Repair Café Datteln" />

	{#snippet faq(entries: FaqEntries)}
		{#each Object.entries(entries) as [question, answer], i}
			<details open={i == 0 ? true : undefined} name="faq{i}">
				<summary><h3><Md inline={question} /></h3></summary>
				<Md block={answer} />
			</details>
		{/each}
	{/snippet}

	<h2>Fragen zum Repair Café Datteln</h2>

	{@render faq(faq_Rc)}
	
	<h2>Fragen zur Website</h2>

	{@render faq(faq_website)}

	<Container type="infoBox">
		<Md block="## Haben Sie eine andere Frage?
		
		Schicken Sie uns Ihre Frage per Email an <frage@repaircafe-datteln.de>."/>
	</Container>

<style>
	h3 {
		font-size: 1.2rem;
	}

	details:not(:has(+ details)){
		margin-bottom: 3rem;
	}
</style>
