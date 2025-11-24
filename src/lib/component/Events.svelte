<script lang="ts">
	import { building } from '$app/environment'
	import Md from './MD.svelte'
	// import { type Event } from 'schema-dts'

	type IsoDate = string
	const dayNames = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	] as const

	interface Props {
		eventData: Record<IsoDate, { notice?: string; deferred?: string; canceled?: boolean }>
		startTime: string
		checkDayOfWeek?: (typeof dayNames)[number]
	}

	const {
		eventData = {
			'2025-11-01': { deferred: '2025-11-08', canceled: true, notice: 'kann leider nicht statt finden!' },
			'2025-12-06': {},
			'2026-01-03': {},
			'2026-02-07': {},
			'2026-03-07': {},
			'2026-04-04': { canceled: true, notice: 'Kein Repair Café im April (Ostern)' },
			'2026-05-02': {},
			'2026-06-06': {},
			'2026-07-04': {},
			'2026-08-01': {},
			'2026-09-05': {},
			'2026-10-03': { deferred: '2026-10-10', notice: 'Verschoben wegen Tag der Deutschen Einheit' },
			'2026-11-07': {},
			'2026-12-05': {},
		},
		startTime = '14:00',
		checkDayOfWeek: checkDay = 'Saturday',
	}: Props = $props()

	if (building) {
		Object.keys(eventData).forEach((isoDate) => {
			if (!isoDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
				throw new Error(`Invalid date format: ${isoDate}, expected: YYYY-MM-DD.`)
			}

			const weekDay = dayNames[new Date(isoDate).getDay()]

			if (weekDay !== checkDay) {
				throw new Error(`Invalid date: ${isoDate} is a ${weekDay} not ${checkDay}.`)
			}
		})
	}

	let nextEvent = $state(
		Object.keys(eventData).findIndex(
			(isoDate) => isoDate + 'T' + startTime > new Date().toISOString(),
		),
	)
	/*
	Todo: const ld:Event = {}

	<script type="application/ld+json">
{
	"@context": "http://schema.org/",
	"@type": "Event",
	"name": "RCD",
	"description": "foo",
	"eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
	"eventStatus": "https://schema.org/EventScheduled",
	"startDate": "2025-01-04T14:00+01:00",
	"endDate": "2025-01-04T17:20+01:00",
	"location": [
		{
			"@type": "Place",
			"name": "Treff",
			"address": {
				"streetAddress": "W8",
				"addressLocality": "D",
				"addressRegion": "",
				"postalCode": "45",
				"addressCountry": "Germany"
			}
		}
	]
}
*/
</script>

<ol>
	{#each Object.entries(eventData) as [isoDate, event], i}
		{#if i > nextEvent - 3}
			{@const date = new Date(Date.parse(event.deferred || isoDate))}
			<li class={{ old: i < nextEvent, next: i == nextEvent, canceled: event.canceled }}>
				<time datetime="{event.deferred || isoDate}T{startTime}">
					{#if event.deferred}
						<em>
							<strong>
								{new Intl.DateTimeFormat('de-DE', { day: 'numeric' }).format(date)}
							</strong>
							{new Intl.DateTimeFormat('de-DE', { month: 'short', year: 'numeric' }).format(date)}
						</em>
					{:else}
						{new Intl.DateTimeFormat('de-DE', {
							day: 'numeric',
							month: 'short',
							year: 'numeric',
						}).format(date)}
					{/if}
				</time>
				{#if event.deferred || event.canceled}
					⚠{/if}
				{#if event.notice}
					<Md block={event.notice} />
				{/if}
			</li>
		{/if}
	{/each}
</ol>

<style>
	ol {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		/* margin-left: 3em; gap: 2em 1em; // don't Work in old Safari */
		margin: -0.25em -0.5em -0.25em 2.5em; /* gap for old Safari */
		padding: 0;
	}
	li {
		margin: 1em 0.5em; /* gap for old Safari */
		flex: 1 0 8.5em;
		list-style: none;
		padding: 0.5em;
		text-align: center;

		border-radius: 0.5em;

		background-color: var(--s-color-bg-article);
		border: 1px solid var(--s-color-primary);
		color: var(--s-color-text-article);

		&::before {
			font-size: 1.25em;
			margin-bottom: 0.5em;

			font-variant-emoji: text;
			content: '🗓 ';
		}
	}

	.canceled {
		
		border-color: #b03030;
		background-color: #ddd;

		& time {
			opacity: 0.7;
			text-decoration: line-through;
		}
	}

	.old {
		color: #737373;
		border-color: #fff;
	}

	@media not all and (prefers-color-scheme: dark) {
		li {
			background-color: var(--s-color-bg-article);
			border: 1px solid var(--s-color-text);
		}

		.next {
			box-shadow: 0.5em 0.25em 0.5em #888;
			border-color: var(--s-color-secondary);
		}
	}

	@media screen and (prefers-color-scheme: dark) {
		li {
			border: 2px solid var(--s-color-primary-contrast);
		}
		.next {
			border: 3px dashed var(--s-color-secondary);
		}
	}

	/*
	@supports (color: light-dark('#fff', '#000')) {
		.infoBox {
			--color-emoji: light-dark('#fff', '#000');
		}
	}
*/
</style>
