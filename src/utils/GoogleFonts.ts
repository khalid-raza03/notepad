// Google Fonts utility for fetching and managing fonts
// API key is loaded from .env file: VITE_GOOGLE_FONTS_API_KEY

const GOOGLE_FONTS_API_KEY = import.meta.env.VITE_GOOGLE_FONTS_API_KEY || '';

interface GoogleFont {
    family: string;
    variants: string[];
    category: string;
}

// Fallback popular fonts if API fails
const POPULAR_FONTS: GoogleFont[] = [
    { family: 'Arial', variants: ['400', '700'], category: 'sans-serif' },
    { family: 'Courier New', variants: ['400', '700'], category: 'monospace' },
    { family: 'Georgia', variants: ['400', '700'], category: 'serif' },
    { family: 'IBM Plex Mono', variants: ['400', '700'], category: 'monospace' },
    { family: 'Inter', variants: ['400', '500', '700'], category: 'sans-serif' },
    { family: 'JetBrains Mono', variants: ['400', '700'], category: 'monospace' },
    { family: 'Lato', variants: ['400', '700'], category: 'sans-serif' },
    { family: 'Merriweather', variants: ['400', '700'], category: 'serif' },
    { family: 'Montserrat', variants: ['400', '700'], category: 'sans-serif' },
    { family: 'Open Sans', variants: ['400', '700'], category: 'sans-serif' },
    { family: 'Playfair Display', variants: ['400', '700', '900'], category: 'serif' },
    { family: 'Poppins', variants: ['400', '600', '700'], category: 'sans-serif' },
    { family: 'Roboto', variants: ['400', '500', '700'], category: 'sans-serif' },
];

// Cache for loaded fonts
const loadedFonts = new Set<string>();

export async function fetchGoogleFonts(): Promise<GoogleFont[]> {
    // If no API key is set, return popular fonts
    if (GOOGLE_FONTS_API_KEY === 'YOUR_GOOGLE_FONTS_API_KEY') {
        console.warn('Google Fonts API key not configured. Using fallback fonts.');
        return POPULAR_FONTS;
    }

    try {
        const response = await fetch(
            `https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONTS_API_KEY}&sort=popularity`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch fonts');
        }

        const data = await response.json();
        return data.items.slice(0, 200); // Limit to 200 popular fonts for performance
    } catch (error) {
        console.error('Error fetching Google Fonts:', error);
        return POPULAR_FONTS;
    }
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