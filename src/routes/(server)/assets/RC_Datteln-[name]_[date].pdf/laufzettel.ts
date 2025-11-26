import { questions, hl, header1, hr, scaleX, selection, textInput, MdText, nextPage } from "$lib/PdfHelper";
import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";

import { fileURLToPath } from "node:url";

const options: MOptions = {
    //    headingFontSizes: [30, 26, 22, 20, 18, 16],
    headingFontSizes: [16, 14, 13, 12, 11, 10],
    headingUnderline: false

};

/*
const markdown = `## Sie möchten defekte Geräte, Haushaltsgegenstände oder Spielzeug vor dem Wegwerfen bewahren?
 
Dann sind Sie bei uns genau richtig.
 
Das ehrenamtliche Team des REPAIR-CAFE
Datteln hilft Ihnen gerne weiter.
 
-----
 
## Wie helfen Repair Cafés bei einer Reparatur?
 
Mit helfenden Händen, Rat und passendem Werkzeug.
Zur Verkürzung der Wartezeit werden Getränke und Kuchen angeboten.
 
## Was kann repariert werden?
 
Elektro- und Haushaltsgeräte, Textilien, Spielzeug, alles was transportiert werden kann.
 
## Welche Kosten fallen an?
 
> Lediglich Materialkosten, falls notwendig.  
Eine freiwillige Spende wird sehr geschätzt.
 
## Wo findet das REPAIR CAFE Datteln statt?
 
Im „Treffpunkt Hachhausen“ der Caritas (Untergeschoss), Westring 8 in Datteln
♿ per Rampe und Fahrstuhl erreichbar
 
## Wer sind die Ansprechpartner?
 
Karl-Heinz Feldhaus und Reiner Spotke
frage@repaircafe-datteln.de
 
## Wann öffnet das REPAIR CAFE Datteln?
 
Jeden 1. Samstag im Monat 14:00 bis 17:00,
letzte Reparaturannahme um 16:30 Uhr
 
::page-brake
 
## Wann öffnet das REPAIR CAFE Datteln *2025*?
 
4. Januar	3. Mai	6. September
1. Februar	7. Juni	4. Oktober
1. März	5. Juli	1. November
5. April	2. August	6. Dezember
 
## Muss man sich anmelden?
 
Nein, eine Anmeldung ist bei uns nicht nötig. 
 
## Wo gibt es weitere Informationen?
 
Auf unserer Webseite repaircafe-datteln.de.
 
::qr
 
Allgemeine Informationen zu Repair Cafés finden Sie auf der Webseite repaircafe.org/de.
 
`;

*/

const defaultMargin = 10

const content: Content[] = [
    await header1(
        'Laufzettel Nr.:',
        [
            'Bitte beachten Sie unsere Hausordnung.',
            'Bei Fragen wenden Sie sich gerne an unserem Empfang.'
        ],
        ['orange', 'header']
    ),

    // hl('Wichtig', false),

    // Text vom Netzwerk Reparatur-Initiativen
    await MdText(`
**Unsere Hausordnung** ist unter anderem im Wartebereich ausgehängt.

Bei allen **„geringfügigen Hilfeleistungen“** – also alles, was als Gefälligkeit, von einem Freund, Nachbar oder Kollege ohne Fachqualifikation auch erledigt werden könnte, gilt ein **stillschweigender Haftungsausschluss** als vereinbart, auch für Schäden während dieser Veranstaltung.

Bei sogenannten **„gefahrenträchtigen Arbeiten“** ist die Haftung für jegliche mögliche Schäden (auch Folgeschäden), auf **grobe Fahrlässigkeit oder Absicht beschränkt**. Dies gilt für das Veranstaltungsformat bzw. den Veranstalter selbst, aber auch für die Mitarbeiter/Helfer. Als gefahrenträchtig werden alle Arbeiten verstanden, wo entweder ein bekanntes Risiko bei der Benutzung besteht, oder aber auch nur bei der Reparatur selbst.

Eine Haftung für die Funktion ist auf den Übergabezeitpunkt beschränkt. Helfer können einen Reparaturversuch (begründet) abbrechen, wenn ein sicherer Betrieb eines Gerätes oder eine Reparatur nicht möglich ist (z.B. benötigtes Ersatzteil nicht erhältlich, zu teuer, Teile fehlen,...). Bei bestehenden Sicherheitsmängeln muss sich der Helfer durch die Unterschrift des Besuchers bestätigen lassen, dass das Gerät nicht weiterbetrieben werden darf. Eine ev. notwendige Entsorgung ist Sache des Besuchers.
`),

    {
        columns: [
            { stack: [hl('Ihr Name (freiwillige Angabe)')], width: 'auto' },
            { stack: [textInput(1)], width: '*' }
        ], columnGap: defaultMargin
    },

    selection(
        [
            'Die Hausordnung und Haftungsbegrenzung akzeptiere ich.',
        ],
        'checkbox',
    ),

    questions(
        [
            'Was möchten Sie mit uns reparieren?',
        ],
        1
    ),
    selection(
        [
            'Es ist ein Gerät, welches direkt an einer 230V Steckdose betrieben wird. („gefahrenträchtige Reparatur“)',
        ],
        'checkbox',
    ),
    hl(
        'Wie können wir helfen?',
    ),
    {
        columns: [
            {
                stack: [selection([
                    'Eine beim letztem Besuch unterbrochene Reparatur soll fortgesetzt werden. Helfer',
                ],
                    'checkbox')], width: 'auto'
            },
            { stack: [textInput(1)], width: '*' }
        ], columnGap: defaultMargin
    },

    selection(
        [
            'Gerät lässt sich nicht einschalten.',
            'Ersatzteil muss ausgetauscht werden.',
            'Etwas muss genäht werden.',
        ],
        'checkbox',
        false,
        [0, -5, 0, 5]
    ),
    {
        columns: [
            {
                width: 'auto',
                stack:
                    ['Ich vermute ein Defekt in der ']
            },
            {
                width: '*',
                stack: [
                    selection(
                        [
                            'Elektronik',
                            'Mechanik',
                            'Batterie/Akku/Netzteil'
                        ],
                        'checkbox',
                        false,
                        [0, 0]
                    ),]
            }
        ], columnGap: defaultMargin, marginBottom: defaultMargin
    },

    questions(
        [
            'Weitere Beschreibung des Defekts',
        ]
        , 4
    ),
    /*
        'Mit Ihrer Unterschrift akzeptieren Sie unsere im Wartebereich ausgehängte Hausordnung.',
        'Bitte lesen Sie auch die Hinweise auf der Rückseite.',
    
        {
            columns: [
                {
                    width: scaleX(undefined, .33),
                    stack: [
                        ' ',
                        textInput(1),
                        'Datum',
                    ]
                },
                [
                    ' ',
                    textInput(1),
                    {
                        text: 'Unterschrift',
                    },
                ],
            ], columnGap: 5 * defaultMargin
        },
    */
    nextPage(),

    questions(
        [
            'Zur Erinnerung: (Namen, Benötigte Ersatzteile etc.)',
        ],
        3
    ),
    hr(),
    hl('Hinweis bezüglich „Zustimmung zur Daten-Verarbeitung“', false),

    // Datenschutz-Grundverordnung
    await MdText(`Gemäß Artikel 2 Absatz 1 der DSGVO unterliegt dieses Formular nicht der DSGVO, denn es wird nicht digitalisiert. Selbstverständlich werden dennoch nur notwendige Angaben erbeten und diese nur Zweckmäßig verwendet.`),

    hl('Vom Reparaturhelfer auszufüllen:', false),

    {
        columns: [
            { stack: [hl('Helfer')], width: 'auto' },
            { stack: [textInput(1)], width: '*' }
        ], columnGap: defaultMargin
    },
    {
        columns: [
            { stack: [hl('Die Reparatur')], width: 'auto' },
            {
                stack: [selection(
                    [
                        'ist gelungen',
                        'war nicht möglich',
                        'wurde unterbrochen',
                    ],
                    'radio',
                    false,
                    [0, 5]
                )], width: '*'
            }
        ], columnGap: defaultMargin
    },
    selection(
        [
            'Ersatzteil muss beschafft werden',
            'die Beschaffung übernehme ich (Helfer)',
        ],
        'checkbox',
        false,
        [0, -5, 0, 5]
    ),
    selection(
        [
            'Das Gerät ist nicht mehr betriebssicher und muss entsorgt werden',
            'Der Besitzer wurde darüber informiert',
        ],
        'checkbox',
        false,
        [0, -5, 0, 5]
    ),
    {
        columns: [
            {
                width: scaleX(undefined, .33),
                stack: [
                    ' ',
                    textInput(1),
                    'Datum',
                ]
            },
            [
                ' ',
                textInput(1),
                {
                    text: 'Unterschrift',
                },
            ],
        ], columnGap: 5 * defaultMargin
    },
    ' ',

    hl('Ihr Feedback (optional)', false),

    'Bitte teilen Sie uns mit, falls etwas nicht Ihren Erwartungen entsprach. So können wir unsere Veranstaltungen verbessern.',
    ' ',

    {stack:
        [
            'Was hat Ihnen gefallen?',
            'Hat Ihnen etwas gestört?',
            'Was sollten wir Ihrer Meinung nach anders machen?'
        ], style: 'h3'

    },
    textInput(
        8
    ),
]

export async function docDefinition() {
    const docDefinition: TDocumentDefinitions = { content: content }
    docDefinition.language = 'de-DE'
    docDefinition.pageSize = 'A4'
    docDefinition.pageOrientation = 'portrait'
    docDefinition.defaultStyle = {
        fontSize: 10
    }

    /*    docDefinition.content = [
            docDefinition.content
        ]
    */

    return docDefinition
}

/** used to read the last modified Date
 */
export const file = fileURLToPath(import.meta.url)

