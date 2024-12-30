// we don't need any JS on most pages, but we'll load
// it in dev so that we get hot module replacement

import { dev } from '$app/environment'
export const csr = true // dev
/*
! Important !:
    Move pages with a component that needs JS in Browser
    ie `export const csr = true` into the (csr) subdirectory.

    Partial hydration: https://github.com/sveltejs/kit/issues/1390 
*/

// This can be false if you're using a fallback (i.e. SPA mode)
export const prerender = true
//	export const prerender = false
export const trailingSlash = 'always'
