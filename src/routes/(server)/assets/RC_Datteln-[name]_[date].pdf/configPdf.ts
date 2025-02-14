import { dev } from '$app/environment'
import { isoDate } from '$lib/isoDate'
import { fstatSync, openSync } from 'node:fs'

/** 
 * [name]: file import
 * 
 * name with leading underscore are excluded from prerendering 
 **/
export const pdf = {
    'Feedback': import('./feedback'),
    'Laufzettel(Entwurf)': import('./laufzettel'),
} as const

/* short version, needs to match the [location] part of route */
export const location = 'Datteln'
/* , needs to match the subdir(s) in the route */
const clientDir = '/assets/'

export const cacheDir = 'cache/'

export type PdfName = keyof typeof pdf
export const availablePdfs = Object.keys(pdf) as PdfName[]
/*
export const testPdfs = Object.keys(pdf).filter(
    (name) => name.startsWith('_')
) as PdfName[]
*/
export async function getDate(name: PdfName) {
	const file_fd = openSync((await pdf[name]).file, 'r')
    const modTime = fstatSync(file_fd).mtime
    return isoDate(modTime, dev && modTime.getTime() > (new Date().getTime() - 600000 /* = 10 min */) )
}

export async function getPdfPath(name: PdfName, clientPath = true) {
	const date = await getDate(name)

    return `${clientPath ? clientDir : ''}RC_${location}-${name}_${date}.pdf`
}
