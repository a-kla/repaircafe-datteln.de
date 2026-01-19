import { checkBox, questions, header1, textInput, nextPage } from "$lib/PdfHelper";
import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";

const defaultMargin = 10;

const content: Content[] = [
    await header1(
        'Feedbackbogen',
        [
            'Bitte sagen Sie uns Ihre ehrliche Meinung.',
            'Dieses Feedback ist für uns wichtig,',
            'um uns kontinuierlich zu verbessern.',
        ]),

    questions(
        [
            'Wie bewerten Sie das Annahmeverfahren?',
            'Ist der Anmeldebogen verständlich?',
            'Sind die Wartezeiten angemessen?',
            [
                'Was halten Sie davon, dass es bei uns nicht „der Reihe nach“ geht?',
                'Unsere Reparateure wählen aus den Reparatur-Anfragen diejenigen aus von denen sie annehmen, dass ihre fachlichen Fähigkeiten hierfür vorhanden sind. Trotz Berücksichtigung der Anmeldenummern kommt es dadurch zu teils sehr unterschiedlichen Wartezeiten.'
            ],
        ]
        , [
            'sehr gut',
            'gut',
            'in Ordnung',
            'nicht zufriedenstellend',
        ] as const
    ),

    questions(
        [
            ['Möchten Sie bei der Reparatur mehr zuschauen/mitwirken?',
                ''
            ],
        ]
        , [
            'Ja sehr',
            'Ja',
            'Kuchen essen ist auch in Ordnung ;-)',
            'Nein',
        ]
    ),

    questions(
        [
            'Was halten Sie vom Kuchen- und Getränkeangebot der Cafeteria?',
            'Wie beurteilen Sie die Räumlichkeiten?',
            'Wie beurteilen Sie die Fähigkeiten der Mitarbeiter/innen des Repair-Cafés?',
        ]
        , [
            'sehr gut',
            'gut',
            'in Ordnung',
            'nicht zufriedenstellend',
        ] as const
    ),
//     { text: 'Auf der Rückseite geht es weiter…', pageBreak: 'after', marginTop: defaultMargin },
    nextPage(),

    questions(
        [
            ['Wie sind Sie auf uns aufmerksam geworden?', ' (Mehrfaches Ankreuzen ist möglich)']
        ], [
        'eigene Recherche',
        'Tageszeitung',
        'Internet',
        'Flyer',
        'Empfehlung',
    ],
        "checkbox",
        true,
    ),

    {
        columns: [
            { text: [checkBox('weiteres'), ', bitte benennen:'], width: 'auto' },
            textInput(.7)
        ], columnGap: 2 * defaultMargin, marginBottom: defaultMargin, marginTop: - defaultMargin
    },


    questions(
        [
            ['Wie informieren Sie sich über unsere Termine?', ' (Mehrfaches Ankreuzen ist möglich)']
        ], [
        'Tageszeitung',
        'Flyer',
        'Ich frage meinen Nachbarn / Bekannten',
        'Ich frage Siri / Google & Co.',
        'Facebook',
        'Internetseite: repaircafe.org',
        'Internetseite: reparatur-initiativen.de',
    ],
        "checkbox",
        true,
    ),


    [
        {
            columns: [
                { text: ['( ', checkBox('per Kalender')], width: 'auto' },
                { text: [checkBox('per E-Mail'), ' )'], width: '*' },

            ], columnGap: 2 * defaultMargin, marginLeft: defaultMargin, marginTop: - defaultMargin
        },
        { text: checkBox('Internetseite: repaircafe-datteln.de'), marginBottom: 10 },
    ],

    questions(
        [
            'Was gefällt Ihnen besonders gut?',
            'Welche Tipps haben Sie für uns, um diese Veranstaltung zu verbessern?',
        ]
        , 5
    ),

    { text: 'Vielen Dank,', style: 'orange', bold: true, alignment: 'center', fontSize: 20, marginTop: 5 },
    { text: 'dass Sie sich die Zeit zum Ausfüllen dieses Fragebogens genommen haben.', alignment: 'center' },
]

export async function docDefinition() {
    const markdown = ``

    const docDefinition: TDocumentDefinitions = {content: content} // await mdpdfmake(markdown, options)

    docDefinition.language = 'de-DE'
    docDefinition.pageSize = 'A4'
    docDefinition.pageOrientation = 'portrait'
    docDefinition.defaultStyle = {
        fontSize: 10
    }
    // docDefinition.content = [docDefinition.content, content]

    return docDefinition
}

/** used to read the last modified Date */
export const file = import.meta.filename

