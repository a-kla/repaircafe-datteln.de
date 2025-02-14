export const ssr = true

/*
    we don't need to render the whole website in browser again,
    but few components use client side JS so we can't disable CSR :/

    Partial hydration: https://github.com/sveltejs/kit/issues/1390 
*/
export const csr = true // dev

export const prerender = true

export const trailingSlash = 'always'
