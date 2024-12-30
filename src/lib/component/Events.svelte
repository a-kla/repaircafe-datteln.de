<script lang="ts">
	import Md from './MD.svelte'
	// import { type Event } from 'schema-dts'

	type IsoDate = string

	interface Props {
		eventData: Record<IsoDate, { notice?: string; deferred?: string; canceled?: boolean }>
		startTime: string
	}

	const {
		eventData = {
			'2024-12-07': {},
			'2025-01-04': {},
			'2025-02-01': {},
			'2025-03-01': { notice: '10 Jahre RC Datteln' },
			'2025-04-04': {},
			'2025-05-03': {},
			'2025-06-07': {},
			'2025-07-05': {},
			'2025-08-02': {},
			'2025-09-06': {},
			'2025-10-04': {},
			'2025-11-01': { deferred: '2025-11-08', notice: 'wegen Allerheiligen' },
			'2025-12-06': {},
		},
		startTime = '14:00',
	}: Props = $props()

	let nextEvent = $state(
		Object.keys(eventData).findIndex((isoDate) => isoDate + 'T' + startTime > new Date().toISOString())
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
		<li class={{ old: i < nextEvent, next: i == nextEvent }}>
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
			{#if event.deferred}
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
