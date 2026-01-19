import { mdpdfmake } from "mdpdfmake";

import logo1 from '$lib/assets/images/RepairCafe_Datteln_Logo_6.png'
import { read } from '$app/server'; // if not used building fails (Adapter-static doesn't copy it)

// used on Browser
import * as pdfMake from "pdfmake/build/pdfmake";
/* run `pnpm build:pdf-vfs` to update */
import * as pdfFonts from "./assets/pdf/vfs_fonts";
// used on Server
import PdfPrinter from 'pdfmake';
import { fileURLToPath } from "url";

if (browser) {
  // @ts-expect-error @types/pdfmake needs fix
  (pdfMake).addVirtualFileSystem(pdfFonts);
}

import fs from 'fs';
import type { Column, Content, ContentColumns, ContentStack, ContentText, ContentTocItem, ContextPageSize, DynamicContent, LineStyle, Margins, TDocumentDefinitions, TFontDictionary } from "pdfmake/interfaces";
import { browser } from "$app/environment";
import { dirname } from "path";
import { isoDate } from "./isoDate";

const mm2pt = (mm: number) => (72 / 25.4) * mm

type PdfFile = string;

function assertPdfFile(value: string): asserts value is PdfFile {
  const fileRegex = /^[0-9a-zA-Z_\-\/]+\.pdf$/;
  if (!fileRegex.test(value)) {
    throw new Error(`"${value}" is not a valid file name (${fileRegex}).`);
  }
}

const marginX = 10;
const marginY = 20;
const pageLayout = {
  /** @see https://github.com/bpampuch/pdfmake/blob/master/src/standardPageSizes.js */
  width: 595.28,
  height: 841.89,
  margins: [mm2pt(marginX), mm2pt(marginY), mm2pt(marginX), mm2pt(marginY)]
} as const

const defaultMargin = 10

export const scaleX = (extraMargin = 0, scaleFactor = 1) =>
  (pageLayout.width - pageLayout.margins[0] - pageLayout.margins[2] - extraMargin) * scaleFactor

type ImageType = 'png' | 'jpeg'
type Base64String = `data:image/${ImageType};base64,${string}`;

export const imageAsBase64Url = async (
  filename: string,
  imageType: ImageType = 'png'): Promise<Base64String> => {
  try {
    const base64String = Buffer.from(await read(filename).arrayBuffer()).toString('base64url')
    // console.log(`base64String`, base64String.slice(0, 100))
    return `data:image/${imageType};base64,${base64String}`
  } catch (error) {
    console.warn(error);

    throw new Error(`file ${filename} dos not exist`)
  }
}

/**
 * convert Markdown to PDF Content using mdPdfMake
 * 
 * !!! Don't use this for Headlines, use hl() instead
 **/
export const MdText = async (markdown: string, options: MOptions = {
  headingFontSizes: [28, 16, 14, 13, 12, 11],
  headingUnderline: false,
}
) => {
  const content = (await mdpdfmake(markdown, options)).content
  // console.log(content);
  return content
}

export const nextPage = ():Content => ({ text: '', pageBreak: 'after' })

export const getPdfAsBuffer = async (
  file: PdfFile,
  docDefinition: TDocumentDefinitions,
) => {

  const fontPath = browser
    ? ''
    /* ugly fix: "no such file or directory" Error on build
    * maybe obsolete with pdfmake 0.3
    */
    : dirname(fileURLToPath(import.meta.url))
      .replace('.svelte-kit/output/server/chunks', 'src/lib') + '/assets/pdf/fonts/'

  const fonts = {
    Roboto: {
      normal: fontPath + 'Roboto-Regular.ttf',
      bold: fontPath + 'Roboto-Medium.ttf',
      italics: fontPath + 'Roboto-Italic.ttf',
      bolditalics: fontPath + 'Roboto-MediumItalic.ttf'
    },
    Fontello: {
      normal: fontPath + 'fontello.ttf'
    }
  }

  const printer = new PdfPrinter(fonts as TFontDictionary)
  const pdfDoc = printer.createPdfKitDocument(docDefinition, {bufferPages: true})

  const range = pdfDoc.bufferedPageRange()
  console.log(range);
  

  // pdf-lib code
  // const pdf = await pdfDoc.save()

  // pdfDoc.pipe(fs.createWriteStream(file));
  pdfDoc.pipe(fs.createWriteStream(file))
  pdfDoc.end()

}

export const createPdf = (
  file: PdfFile,
  title: string,
  docDefinition: TDocumentDefinitions,
  content: Content | undefined = undefined,
  /*  header: Content | undefined = undefined,
    footer: Content | DynamicContent | undefined = (currentPage, pageCount) => ({
      columns: [
        { text: `${currentPage} / ${pageCount}`, color: 'red', fontSize: 10 },
        {
          text: new Intl.DateTimeFormat('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit', timeStyle: 'short' }).format()
          , alignment: 'right', color: 'lightgray', fontSize: 8
        }
      ]
    }),
    language = 'de-DE',
  */
) => {
  // assertPdfFile(file)

  //  const printer = new pdfMake.createPdf();

  //  console.log(Buffer.from(logo).toString('base64'));
  if (content) docDefinition.content = content

  docDefinition = Object.assign({
    // compress: false,
    // version: '1.7ext3', // PDF version
    subset: 'PDF/A-3a', // Subset types: // PDF/A-1, PDF/A-1a, PDF/A-1b, PDF/A-2, PDF/A-2a, PDF/A-2b, PDF/A-3, PDF/A-3a, PDF/A-3b, PDF/UA
    tagged: true, // Mark document as Tagged PDF
    displayTitle: true, // Display of document title in window title
    pageMargins: [...pageLayout.margins],
    info: {
      title: title,
    },
    permissions: {
      printing: 'highResolution',
      modifying: false,
      copying: true,
      annotating: true,
      fillingForms: true,
      contentAccessibility: true,
      documentAssembly: true
    },
    // watermark: { text: 'test PDF/AU', angle: -70 },
    // background: (currentPage: number, pageSize: ContextPageSize) => `page ${currentPage} with size ${pageSize.width} x ${pageSize.height}`,
    content: [
      '(PDF/A document without content)'
    ],
    // header: header,
    footer: (currentPage, pageCount) => {
      if (pageCount == 1) {
        return {
          text: isoDate(undefined, true)
          , color: 'lightgray', fontSize: 8
          , marginLeft: pageLayout.margins[0]
          , marginRight: pageLayout.margins[2]
        }
      }

      if (pageCount == 2 && currentPage == 1) {
        return {
          columns: [
            {
              text: isoDate(undefined, true)
              , color: 'lightgray', fontSize: 8
            },
            { text: `Bitte die Rückseite beachten`, style: 'orange', fontSize: 10, alignment: 'right' },
          ]
          , marginLeft: pageLayout.margins[0]
          , marginRight: pageLayout.margins[2]
        }
      }

      return {
        columns: [
          {
            text: isoDate(undefined, true)
            , color: 'lightgray', fontSize: 8
          },
          { text: `Seite ${currentPage} / ${pageCount}`, color: 'gray', fontSize: 10, alignment: 'right' },
        ]
        , marginLeft: pageLayout.margins[0]
        , marginRight: pageLayout.margins[2]
      }
    },
    defaultStyle: {
      fontSize: 10,
      lineHeight: 1.5,
    },
    styles: {
      header: {
        fontSize: 12,
        bold: true,
        lineHeight: 1.5,
      },
      h1: {
        fontSize: 28,
        bold: true,
        color: '#2d378b',
        marginTop: 0,
        marginBottom: defaultMargin,
      },
      h2: {
        fontSize: 16,
        bold: true,
        marginTop: 0,
        marginBottom: defaultMargin,
      },
      h3: {
        fontSize: 14,
        bold: true,
        marginTop: 0,
        marginBottom: defaultMargin,
      },
      orange: {
        color: '#f25846',
      },
      blue: {
        color: '#2d378b',
      },
      icon: { font: 'Fontello', fontSize: 10, color: '#2d378b', marginRight: defaultMargin }
    },
    /*    images: {
          logo: convertImageToBase64URL(logo),
        },
    */
  } satisfies TDocumentDefinitions
    , docDefinition
  );

  const fontPath = browser
    ? '.'
    /* ugly fix: "no such file or directory" Error on build
    * maybe obsolete with pdfmake 0.3
    */
    : dirname(fileURLToPath(import.meta.url))
      .replace('.svelte-kit/output/server/chunks', 'src/lib') + '/assets/pdf/fonts/'

  const fonts = {
    Roboto: {
      normal: fontPath + 'Roboto-Regular.ttf',
      bold: fontPath + 'Roboto-Medium.ttf',
      italics: fontPath + 'Roboto-Italic.ttf',
      bolditalics: fontPath + 'Roboto-MediumItalic.ttf'
    },
    Fontello: {
      normal: fontPath + 'fontello.ttf'
    }
  }

  if (browser /* includes dev */) {
    // @ts-expect-error addFonts() exist, outdates Types?
    pdfMake.addFonts(fonts);
    const pdfDoc = pdfMake.createPdf(docDefinition)

    pdfDoc.getBuffer(
      (pdf) => {
        try {
          fs.writeFileSync('./' + file, pdf);
        } catch (err) {
          console.error(err);
        }
      })
  } else {
    const printer = new PdfPrinter(fonts as TFontDictionary);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    pdfDoc.pipe(fs.createWriteStream(file));
    pdfDoc.end();
  }
}

export const hr = (width = 1, lineHeight = 0.25, dash?: LineStyle, color?: string): Content => (
  {
    table: {
      widths: ['*'],
      body: [[' '], [' ']]
    },
    lineHeight,
    layout: {
      hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 0 : width,
      vLineWidth: () => 0,
      hLineColor: color || '#2d378b',
      hLineStyle: () => dash ? dash : null,
    },
  }
)

/**
 Fake radio Buttons and checkBox by using a font-icon
 
 Why?
    pdfmake don't support form inputs
    and AFAIK they can't be interactive in PDF/A anyway
 */
const icon = (emoji: string): ContentText => ({ text: emoji, style: 'icon', lineHeight: 1.5 })
export const radioButton = (label: string) => ({ text: [icon(''), ' ' + label] })
export const checkBox = (label: string) => ({ text: [icon(''), ' ' + label] })

export const selection = (
  labels: string[],
  type: 'radio' | 'checkbox' = 'radio',
  multiline = false,
  margins: Margins = [0, defaultMargin],
): ContentColumns | ContentStack => {
  if (multiline) {
    return {
      stack: labels.map(
        (label) =>
          type == 'checkbox' ? checkBox(label) : radioButton(label)
      ), margin: margins
    }
  }
  // else
  return {
    columns: labels.map(
      (label) =>
        ({ text: type == 'checkbox' ? checkBox(label) : radioButton(label), width: 'auto' })
    )
    , columnGap: 20, margin: margins
  }
}

/**
 * @param options number of rows for text input or params for selection()
 * 
 * @example feedback(
        ['Do you like it?', 'Do you want more?'],
        ['yeeeees!', 'yes', 'noop', ],
        "radio",
    ),

 **/
export const questions = (questions: ReadonlyArray<string | readonly [string, string]>, ...options: [number] | Parameters<typeof selection>): ContentStack => {
  // needs to be a func or it works only once (guess: position in the Doc won't update) 
  const answers =
    typeof options[0] === 'number' ?
      () => textInput(
        /* @ts-expect-error its number */
        options[0])
      : () => selection(
        /* @ts-expect-error its not number */
        ...options
      )

  return {
    stack: (questions)
      .map(
        (question) => {
          if (typeof question == 'string') {
            return [hl(question), answers()]
          }
          // else {
          return [
            hl(question[0]),
            { text: question[1], lineHeight: 1.2, },
            answers()
          ]
        }
      )
  }
}

export const textInput = (rows: number): ContentStack | Content => (
  rows < 1 ?
    hr(rows > 0 ? rows : 0.5, .75, { dash: { length: 5 } })
    : {
      stack:
        Array.from({ length: rows }).map(
          () => hr(1, .75, { dash: { length: 5 } })
        )
    }
)

export const textInputLine = (label: string, width: number, headline: false | '1' | '2' | '3' = false): Column => {

  return {
    columns: [
      { text: headline ? [hl(label, undefined, headline)] : label, width: `${width}%` },
      textInput(1)
    ], columnGap: 2 * defaultMargin, marginBottom: defaultMargin
  }
}

/** HeadLine (like html tag h1, h2, h3) */
export const hl = (title: string, pageBreak = false, level: '1' | '2' | '3' = '2'): ContentTocItem => ({
  text: title,
  style: 'h' + level,
  tocItem: true,
  pageBreak: pageBreak ? 'before' as 'before' : undefined,
})

export const header1 = async (title: string, text: string[], styles: string | string[] = 'header'): Promise<ContentColumns> =>
(
  {
    columns: [
      {
        stack: [
          hl(title, false, '1'),
          text.map(
            (line) => ({
              text: line,
              style: styles,
            })
          )
        ], width: '*'
      },
      {
        image: await imageAsBase64Url(logo1),
        width: scaleX(undefined, 0.34)
      },

    ], columnGap: 20, marginBottom: 20,
  }
)



/*

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe.skip('mm2pt() test',
    () => {
      it('calcs right',
        () => {
          expect(mm2pt(0)).toBe(0)
          console.log(mm2pt(1));
          console.log(mm2pt(5));
          expect(mm2pt(25.4)).toBe(72)
        }
      )
    }
  )

  describe
    .skip
    ('Create PDF',
      () => {
        it('MD => PDF',
          async () => {
            const docDefinition: TDocumentDefinitions = await mdpdfmake(markdown, options)
            /*
                        console.log(Object.values(docDefinition.content).filter(
            
                          (node) => {
                            //              console.log(node.text);
            
                            return Array.isArray(node.text) && node.text.length == 1 ? true : false
                          }
                        ).map(
                          (o) => o.text
                        ));
            * /

            const foo = (docDefinition: TDocumentDefinitions) => {
              // Use docDefinition with a PDFMake instance to generate a PDF
              docDefinition.language = 'de-DE'
              docDefinition.pageSize = 'A4'
              docDefinition.pageOrientation = 'portrait'
              docDefinition.defaultStyle = {
                fontSize: 10
              }

              createPdf('test-results/MD_test.pdf', 'PDF Test', docDefinition,
                [docDefinition.content, content],
              )

              console.log('finished');
            }

            foo(docDefinition)

          }
        )


        it
          .skip
          ('save file…',
            () => {
              const color1 = 'red'
              const color2 = 'blue'
              let colorCounter = 0
              const autoColor = () => {
                ++colorCounter
                return colorCounter % 2 ? color1 : color2
              }

              try {
                createPdf('test-results/test.pdf', 'PDF Test',
                  {
                    content: 'none'
                  },
                  [
                    hr(2, 1),
                    { image: 'logo', width: scaleX() },
                    'Sie möchten defekte Geräte, Haushaltsgegenstände oder Spielzeug vor dem Wegwerfen bewahren?',
                    { text: 'Dann sind Sie bei uns genau richtig.', alignment: 'right' },
                    { text: ['Das ehrenamtliche Team des ', { text: 'REPAIR-CAFE Datteln', color: autoColor(), }, ' hilft Ihnen gerne weiter.'], alignment: 'center' },
                    hr(),
                    {
                      columns: [
                        [{ qr: 'Test QR', margin: mm2pt(5) },
                        { text: ['QR Code', { text: 45, style: 'red' }, 'foo'] }
                        ],
                        { qr: 'Test QR Right' },
                      ]
                    },
                  ],
                  {
                    text: 'HEader test',
                    style: 'header', alignment: 'center',
                    fontSize: mm2pt(10),
                    marginTop: mm2pt(5),
                  }

                )
              }

              catch (error) {
                console.error(error);
                throw error
              }
              //            expect(fn).not.Throw()
            }
          )
      }
    )

}

*/