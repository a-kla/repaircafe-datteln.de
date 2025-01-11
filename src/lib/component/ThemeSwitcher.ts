/**
 * Swap `light` and `dark` in the media rules (switching color schemes aka themes).
 * 
 * Simply setting a class requires to duplicate the css.
 * You need css in the media query and the same css in a `light` (or dark) class.
 * 
 * Uses session storage item 'forceScheme' to temporary store the chosen color scheme
 * 
 * Based on: https://stackoverflow.com/a/76795904 
 * modified by André Klawon
 * 
 * Licensed under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).
 * 
 * Copyright (c) 2023 some1and2
 * Copyright (c) 2024 André Klawon
 * 
 * You are free to:
 * - Share — copy and redistribute the material in any medium or format
 * - Adapt — remix, transform, and build upon the material
 * for any purpose, even commercially.
 * 
 * Under the following terms:
 * - Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
 * - ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.
 * 
 * No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.
 */

type Scheme = 'dark' | 'light'

/*
    Function for switching the rules for perfers-color-scheme
    Goes through each style sheet file, then each rule within each stylesheet
    and looks for any rules that require a prefered colorscheme, 
    if it finds one that requires light theme then it makes it require dark theme / vise versa.
    The idea is that it will feel as though the themes switched even if they haven't. 
*/
export function switch_theme_rules() {
    // console.warn('switching');

    for (let sheet_file = 0; sheet_file < document.styleSheets.length; sheet_file++) {
        try {
            for (let sheet_rule = 0; sheet_rule < document.styleSheets[sheet_file].cssRules.length; sheet_rule++) {
                const rule = document.styleSheets[sheet_file].cssRules[sheet_rule];

                if (rule instanceof CSSMediaRule && rule.media.mediaText.includes("prefers-color-scheme")) {
                    const rule_media = rule.media.mediaText;

                    let new_rule_media: string | undefined

                    if (rule_media.includes("light")) {
                        new_rule_media = rule_media.replace("light", "dark");
                    }
                    else if (rule_media.includes("dark")) {
                        new_rule_media = rule_media.replace("dark", "light");
                    }

                    if (new_rule_media) {
                        rule.media.deleteMedium(rule_media);
                        rule.media.appendMedium(new_rule_media);
                    }
                }
            }
        }
        catch (e) {
            console.warn('Broke something with theme toggle', e, 'try on: ' + document.styleSheets[sheet_file].href || 'inline css');
        }
    }
}

/**
 * Get the system color scheme or a defaultScheme
*/
export function get_system_theme(defaultScheme: Scheme) {
    const contrary = defaultScheme == 'dark' ? 'light' : 'dark'
    return window.matchMedia(`(prefers-color-scheme: ${contrary})`).matches ? contrary : defaultScheme;
}

/**
 * Toggle the color scheme depending on the 'forceScheme' Value stored in session storage
*/
export function use_stored_theme(defaultScheme: Scheme = 'light') {
    const system = get_system_theme(defaultScheme)
    const stored = sessionStorage.getItem('forceScheme')

    if (stored && stored !== system) {
        switch_theme_rules()
    }

    /*
     * don't change the color if a fixed light/dark mode was chosen 
    */
    window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => {
            if (sessionStorage.getItem('forceScheme') !== null) {
                switch_theme_rules()
            }
        });

    // return stored || system
}

/**
 * Save color theme in session storage and toggle the color schemes (if needed)
 * 
 * @param newTheme Set to null / undefined to use the system scheme
 *        and remove the entry from session storage
*/
export function set_theme(newTheme: Scheme | undefined, defaultScheme: Scheme = 'light') {

    const system = get_system_theme(defaultScheme)
    const current = sessionStorage.getItem('forceScheme')

    if (newTheme == undefined) {
        if (current && current != system) {
            switch_theme_rules()
        }
        sessionStorage.removeItem("forceScheme");
    } else {
        if (newTheme != (current || system)) {
            switch_theme_rules()
        }
        sessionStorage.setItem("forceScheme", newTheme);
    }
}
