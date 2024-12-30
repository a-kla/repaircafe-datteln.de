# Infos zum Markdown

TODO: Frontmatter

## Absätze und Umbrüche

Absätze werden durch
Leerzeilen voneinander
getrennt.⏎

Einen Umbruch erzwingt man
durch ein Leerzeichen und ein \ vor dem Umbruch (␣\⏎). \
Einfache Umbrüche (⏎)
werden ignoriert.

## Überschriften

# Überschrift 1. Grades (h1)

⚠ Verwendung selten nötig
In page.svx wird die Seitenüberschrift automatisch aus dem Frontmatter `title: …` erstellt
In page.svelte wird die Seitenüberschrift mittels `<Head …/>` Component erzeugt

## Überschrift 2. Grades ##

…

###### Überschrift 6. Grades

Optional kann man Überschriften mit entsprechenden #-Symbolen abschließen.

## Text-Auszeichnung

*Kursiv* hervorgehoben
**Fett** hervorgehoben
***Fett und Kursiv***
hervorgehoben
Kursiv hervorgehoben
Fett hervorgehoben
Fett und kursiv hervorgehoben
Alternativ kann man den Unterstrich (_) statt des Sternchens verwenden.

## Listen und Aufzählungen

* Ungeordnete Listen beginnen mit einem *, - oder +.
* Verschachtlung durch
  * Einrückung mit mindestens
    zwei Leerzeichen oder
    einem Tab.
  * Absätze entstehen
  
  durch Fortsetzung
  der Einrückung⏎

1. Aufzählungen beginnen mit Zahlen
9. Die richtige Nummerierung
5. ist nicht wichtig

## Hyperlinks

[Link-Text](http://url.tld)
[Link](http://url.tld "title")
Referenzierte Links:
[Link-Text][id]
Link auf [Mac & i].
[Link][id2] mit Title-Attribut
[id]: http://url.tld
[Mac & i]: http://mac-and-i.de
[id2]: http://url.tld " title"

### reine E-Mail-Adressen und URLs

Verlinkte <mail@adresse.tld>
Verlinkte URL <http://url.tld>

## Bilder

![Alt-Text](pfad/bild.png)

### Referenzierte Bilder

Ein Bild ![Alt-Text][id]

[id]: pfad/bild.png

Wie bei den Hyperlinks kann man auch optional das "Title"-Attribut angeben.

## Zitate (Blockquotes)

> Zitat-Blöcke funktionieren
> wie bei E-Mails
> > inklusive Verschachtlung
| Zitat-Blöcke funktionieren
| wie bei E-Mails
|
| | inklusive Verschachtlung
| |

## Code

```Markdown
  # Code-Block
```

Und `Inline-Code`.

## Trennlinie

3 alleinstehende `-`

```Markdown
---
```

---

## Escape-Sequenz

3\. Keine Aufzählung
Text mit \*Sternchen\*
3. Keine Aufzählung
Text mit *Sternchen*
Die Escape-Sequenz gilt für: \, `, *, _, {, }, [, ], (, ), #, +, -, ., !

## Fußnoten

Text mit Fußnote[^fußnote]
... Beliebiger Text ...
[^fußnote]: Fußnoten-Text
Text mit Fußnote 1
... Beliebiger Text ...

^fußnote: Fußnoten-Text

## Tabellen

\| Spalte 1 | Spalte 2 | Spalte 3 |
\| :------- | :------: | -------: |
\| Zeile 1 | Verbundene Zelle ||
\| Links | *Mitte* | Rechts |

Es gibt Erweiterungen für Code-Editoren, die bei der Erstellung und Formatierung helfen.

