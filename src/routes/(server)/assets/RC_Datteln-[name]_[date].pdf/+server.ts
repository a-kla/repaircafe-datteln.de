import { createPdf, getPdfAsBuffer } from "$lib/PdfHelper.js";
import { readFileSync, existsSync } from "node:fs";
import { type PdfName, cacheDir, location, pdf, getPdfPath, getDate, availablePdfs } from "./configPdf";
import type { EntryGenerator } from "./$types";
import { building } from "$app/environment";

export const prerender = true

export const entries: EntryGenerator = async () => {
	const entries = await Promise.all(
		availablePdfs.map(
			async (name: PdfName) => ({ name, date: await getDate(name) })
		)
	);
	return entries;
}

const readPdf = async (name: PdfName, date: string) => {
	const file = `${cacheDir}${name}-${date}.pdf`;
	if (!existsSync(file)) {
		if (!building) {
			return getPdfAsBuffer(
				file,
				// `${name} - RC ${location}`,
				await (await pdf[name]).docDefinition()
				)
		}

		createPdf(
			file,
			`${name} - RC ${location}`,
			await (await pdf[name]).docDefinition()
		)
		// wait for the file to be written
		await new Promise((resolve) => setTimeout(resolve, 1000))
	}
	return readFileSync(file)
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {

	const pdf = await readPdf(params.name as PdfName, params.date)

	return new Response(pdf, {
		/* irrelevant after building */
		headers: {
			"Content-Type": "application/pdf",
			'Cache-Control': 'max-age=36000, s-maxage=36000, max-stale=36000',
		},
	});
}

if (import.meta.vitest) {
	const { describe, it, expect } = import.meta.vitest

	describe
		.skip
		('_getUrl()',
			() => {
				it('works',
					async () => {
						const expectedUrl = '/assets/RC_Datteln-Feedback_2025-02-07.pdf';
						expect(await getPdfPath('Feedback')).toBe(expectedUrl)
					}
				)
			}
		)
}  