<script lang="ts">
	import { fixRoundingError } from '../fixJS'

	interface Props {
		actionButtons: Record<
			/* ButtonLabel */ string,
			[/* func */ (sum: Euro) => void, /* disabled? */ boolean]
		>
	}
	let { actionButtons = {} }: Props = $props()

	type Euro = number | undefined
	const euro = (eur: number) => eur.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })

	const euroValues = [
		50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01,
	] as const satisfies number[]

	const cash: Array<[(typeof euroValues)[number], [counter: number | undefined, total: Euro]]> =
		$state(euroValues.map((value) => [value, [undefined, undefined]]))

	const resetCash = () => {
		cash.forEach((value, index) => (cash[index] = [value[0], [undefined, undefined]]))
	}

	let cashSum = $derived.by(() => {
		let sum = 0
		for (const [, [, total]] of cash) {
			if (total != null) sum += total
		}

		return fixRoundingError(sum)
	})
</script>

<form onsubmit={(e) => e.preventDefault()}>
	<article>
		<header>Bargeld Zählung</header>
		<div class="grid cash">
			{#each cash as [value, [counter, sum]], index}
				<input
					type="number"
					id={'counter' + index}
					bind:value={cash[index][1][0]}
					placeholder="#"
					max="99"
					min="0"
					tabindex={index + 1}
					onblur={() => {
						const tempCounter = cash[index][1][0] || NaN

						if (Number.isNaN(tempCounter)) {
							cash[index] = [value, [undefined, sum]]
						} else {
							cash[index] = [value, [tempCounter, fixRoundingError(tempCounter * value)]]
						}
					}}
				/>
				<span>
					* {euro(value)} =
				</span>
				<input
					type="number"
					id={'value' + index}
					bind:value={cash[index][1][1]}
					step={value}
					min="0"
					tabindex={index + 1 + cash.length}
					onblur={() => {
						const tempSum = cash[index][1][1]

						if (Number.isNaN(tempSum)) {
							cash[index] = [value, [counter, undefined]]
						} else {
							cash[index] = [value, [counter, tempSum]]
						}
					}}
				/>
			{/each}
		</div>
		<footer>
			<div class="sum">Summe: <output>{euro(cashSum)}</output></div>
			<div class="grid cashButtons">
				{#each Object.entries(actionButtons) as [exportName, [exportFn, exportDisabled]], index}
					<button
						disabled={exportDisabled || undefined}
						onclick={() => {
							exportFn(cashSum)
						}}>{exportName}</button
					>
				{/each}
				<button class="s-secondary" type="reset" onclick={resetCash}>Reset</button>
			</div>
		</footer>
	</article>
</form>

<style>
	input:invalid {
		background-color: #ffdddd;
	}
	input:disabled {
		background-color: #ddd;
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

	.sum {
		font-size: larger;
		text-align: center;
		padding: var(--s-input-block-padding) var(--s-input-padding-inline);

		& > output {
			font-weight: bold;
		}
	}

	.cash {
		grid-template-columns: 1fr 1fr 1fr;

		& input {
			width: 4rem;
			padding: 0.25rem 0.5rem;
		}
	}

	.cashButtons {
		grid-template-columns: 1fr 1fr;
	}

	@container form (width > 30rem) {
		.cash {
			grid-template-columns: repeat(2, 1fr 1fr 1fr);
		}
		.cashButtons {
			grid-template-columns: repeat(2, 1fr 1fr);
		}
	}

	@container form (width > 45rem) {
		.cash {
			grid-template-columns: repeat(3, 1fr 1fr 1fr);
		}
	}
</style>
