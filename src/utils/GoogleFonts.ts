// Google Fonts utility for loading fonts dynamically
// Uses static fonts.json file instead of API calls

import fontsData from '../fonts.json';

interface GoogleFont {
    family: string;
    category: string;
}

// Cache for loaded fonts
const loadedFonts = new Set<string>();

export async function fetchGoogleFonts(): Promise<GoogleFont[]> {
    return fontsData;
}

export function loadFont(fontFamily: string): void {
    // Don't reload if already loaded
    if (loadedFonts.has(fontFamily)) {
        return;
    }

    // Format font family name for URL
    const formattedFont = fontFamily.replace(/\s+/g, '+');

    // Create and append link element
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${formattedFont}:wght@400;500;600;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    loadedFonts.add(fontFamily);
}

export function applyFontToEditor(
    editor: any,
    fontFamily: string
): void {
    console.log('Font Family:', fontFamily);
    if (!editor) return;

    // Load the font if not already loaded
    loadFont(fontFamily);

    // Apply font using textStyle mark - store plain font name
    // renderHTML will add quotes for proper CSS formatting
    editor.chain()
        .focus()
        .setMark('textStyle', {
            fontFamily: fontFamily  // Just plain name, no quotes
        })
        .run();
}

/**
 * Extracts all font families from HTML content
 */
export function extractFontsFromHtml(html: string): Set<string> {
    const fontSet = new Set<string>();
    const fontFamilyRegex = /font-family:\s*['"]*([^'";\n]+)['"]*;?/g;

    let match;
    while ((match = fontFamilyRegex.exec(html)) !== null) {
        const font = match[1].trim().replace(/^['"]|['"]$/g, '').split(',')[0].trim();
        if (font && font !== 'inherit' && font !== 'sans-serif') {
            fontSet.add(font);
        }
    }

    return fontSet;
}

/**
 * Loads all fonts found in HTML content
 */
export function loadFontsFromHtml(html: string): void {
    const fonts = extractFontsFromHtml(html);
    fonts.forEach(font => {
        loadFont(font);
    });
}

/**
 * Maps Google Fonts to PDF-compatible fonts
 */
export function mapGoogleFontToPdfFont(fontFamily: string): string {
    const fontMap: Record<string, string> = {
        'Roboto': 'Helvetica',
        'Open Sans': 'Helvetica',
        'Lato': 'Helvetica',
        'Montserrat': 'Helvetica',
        'Poppins': 'Helvetica',
        'Inter': 'Helvetica',
        'Arial': 'Helvetica',
        'Playfair Display': 'Times-Roman',
        'Merriweather': 'Times-Roman',
        'Georgia': 'Times-Roman',
        'Courier New': 'Courier',
        'IBM Plex Mono': 'Courier',
        'JetBrains Mono': 'Courier',
    };

    // Clean the font family string
    const cleanFont = fontFamily.replace(/^['"\s]+|['"\s]+$/g, '').split(',')[0].trim();

    return fontMap[cleanFont] || 'Helvetica';
}

/**
 * Saves the selected font to localStorage
 */
export function saveSelectedFont(fontFamily: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('selectedFont', fontFamily);
    }
}

/**
 * Retrieves the saved font from localStorage
 */
export function getSavedFont(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem('selectedFont') || 'Arial';
    }
    return 'Arial';
}

/**
 * Clears the saved font from localStorage
 */
export function clearSavedFont(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('selectedFont');
    }
}