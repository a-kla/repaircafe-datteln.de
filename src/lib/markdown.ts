/**
 * Note: We can not compile MD in components using MDsveX as it renders async
 * 
 * move to markdown-it?
 */

import { marked, type MarkedExtension, type MarkedOptions, type Tokens } from 'marked';

type Placeholder =
    | string
    | { toString: () => string }

function dedentText(text: string) {
    const lines = text.split("\n")
    if (lines.length < 2) {
        return lines.join("\n")
    }

    let index = 1 // ignore first line

    // skip empty lines
    while (index < lines.length && lines[index] == '') {
        index++
    }

    const charsToRemove = lines[index].search(/\S|$/)
    // console.log(charsToRemove);

    if (charsToRemove < 1) {
        return lines.join("\n")
    }

    for (; index < lines.length; index++) {
        lines[index] = lines[index].slice(charsToRemove)
    }
    return lines.join("\n")
}

function interpolateTemplate(strings: ReadonlyArray<string>, placeholders: Placeholder[]) {
    if (placeholders.length == 0) return strings[0]

    let template = ''
    for (let index = 0; index < strings.length; index++) {
        template += strings[index]

        const placeholder = placeholders.at(index)
        if (placeholder) {
            if (typeof placeholder == 'string') {
                /* placeholder is const or handled outside this component */
                template += placeholder
            } else {
                template += placeholder.toString()
            }
        }
    }

    return template
}

// Override links 
const rendererLink = {
    link({ href, text }: Tokens.Link) {
        //        console.log('Link!');

        const external = href.startsWith('http') ? href.replace(/^https?\:\/\//, '') : false

        if (external) {
            return `<a href="https://${external}" class="external" rel="external noindex" target="_blank">${text}</a>`
        }
        return false // use default renderer
    }
}

/**
 * compile Markdown (github flavored) template to HTML Block
 * 
 * @use
 * ```JS
 *     mdBlock`Some Markdown that may use ${'string'}.` // <- no ()
 *     // is the same as
 *     mdBlock(['Some Markdown that may use ', '.'], ['string'])
 * ```
 *  @see tests for examples
 */
export function mdBlock(
    template: ReadonlyArray<string>,
    ...placeholders: [...Placeholder[]]
) {
    marked.setOptions(marked.getDefaults())
    marked.use({ renderer: rendererLink });

    const unindented = dedentText(interpolateTemplate(template, placeholders));

    return {
        code: marked.parse(
            unindented,
            {
                gfm: true,
                breaks: false,
            }
        ) as string
    }
}

/**
 * compile Markdown (github flavored) template to inline HTML
 */
export function mdInline(
    template: ReadonlyArray<string>,
    ...placeholders: [...Placeholder[]]
) {
    marked.setOptions(marked.getDefaults())
    marked.use({ renderer: rendererLink });

    return {
        code: marked.parseInline(
            interpolateTemplate(template, placeholders),
            {
                gfm: true,
                breaks: false,
            }
        )
    }
}

/**
 * compile Markdown (github flavored) template to inline HTML
 * with <br /> on linebreak (\n)
 */
export function mdPre(
    template: ReadonlyArray<string>,
    ...placeholders: [...Placeholder[]]
) {
    marked.setOptions(marked.getDefaults())
    marked.use({ renderer: rendererLink });

    return {
        code: marked.parseInline(
            interpolateTemplate(template, placeholders),
            {
                gfm: true,
                breaks: true,
            }
        )
    }
}

/** Renders a markdown Block with given (or default) Marked Options and Extensions */
export function customRender(
    markdown: string,
    options: MarkedOptions | undefined = undefined,
    extensions: MarkedExtension[] = [],
    dedent = true,
) {
    marked.setOptions(marked.getDefaults())
    marked.use(...extensions)
    markdown = dedent ? dedentText(markdown) : markdown;

    return marked.parse(
        markdown,
        options
    ) as string
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest

    describe('mdBlock`` and mdInline``',
        async () => {
            const path = await import('node:path')
            const fs = await import('node:fs')

            const testFile = 'markdownInfo.DE.md'
            const inFile = path.resolve('./tests/', testFile);
            const outFile = path.resolve('./tests/gen/', testFile + '.html')
            
            const testMd = fs.readFileSync(inFile).toString()
            // console.log('md:', testMd)

            it('works as expected',
                async () => {
                    expect((mdInline`*foo*`).code).toEqual("<em>foo</em>")
                    expect((mdBlock`*f*oo`).code).toEqual("<p><em>f</em>oo</p>\n")
                    expect((mdBlock`## foo`).code).toEqual("<h2>foo</h2>\n")
                    await expect((mdBlock([testMd])).code).toMatchFileSnapshot(outFile)
                }
            )
        }
    )
}