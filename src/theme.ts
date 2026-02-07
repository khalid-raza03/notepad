import { createTheme } from '@mui/material';
import type { PaletteMode } from '@mui/material';

// Color Palette Definition
const colors = {
    light: {
        background: '#f8f8ddff',
        paper: '#FFFFFF',
        textPrimary: '#37352F', 
        textSecondary: '#6B6B6B',
        accent: '#3370FF', 
        border: '#c3c2c2ff',
        hover: '#F0F0F0',
    },
    dark: {
        background: '#191919', 
        paper: '#252525', 
        textPrimary: '#D4D4D4',
        textSecondary: '#A0A0A0',
        accent: '#4B84FF', 
        border: '#3F3F3F',
        hover: '#2F2F2F',
    },
};

export const getTheme = (mode: PaletteMode) => {
    const isLight = mode === 'light';
    const palette = isLight ? colors.light : colors.dark;

    return createTheme({
        palette: {
            mode,
            background: {
                default: palette.background,
                paper: palette.paper,
            },
            text: {
                primary: palette.textPrimary,
                secondary: palette.textSecondary,
            },
            primary: {
                main: palette.accent,
            },
            divider: palette.border,
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            h1: { fontWeight: 700, letterSpacing: '-0.02em', color: palette.textPrimary },
            h2: { fontWeight: 600, letterSpacing: '-0.01em', color: palette.textPrimary },
            h3: { fontWeight: 600, letterSpacing: '-0.01em', color: palette.textPrimary },
            body1: { lineHeight: 1.6, color: palette.textPrimary },
            button: { textTransform: 'none', fontWeight: 600 },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor: palette.background,
                        transition: 'background-color 0.3s ease, color 0.3s ease',
                        scrollbarColor: isLight ? '#d1d5db transparent' : '#4b5563 transparent',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: isLight ? '#d1d5db' : '#4b5563',
                            borderRadius: '20px',
                            border: '3px solid transparent',
                            backgroundClip: 'content-box',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: isLight ? '#9ca3af' : '#6b7280',
                        },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                    },
                    elevation1: {
                        boxShadow: isLight
                            ? '0px 1px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.1)'
                            : '0px 1px 3px rgba(0, 0, 0, 0.3), 0px 1px 2px rgba(0, 0, 0, 0.5)',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: '8px',
                        padding: '8px 16px',
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: 'none',
                            backgroundColor: isLight ? '#E5E5E5' : '#333333',
                        },
                    },
                    containedPrimary: {
                        color: '#FFFFFF',
                        '&:hover': {
                            backgroundColor: isLight ? '#2563EB' : '#3B82F6',
                        }
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: '12px',
                        border: `1px solid ${palette.border}`,
                        boxShadow: 'none',
                        '&:hover': {
                            borderColor: palette.accent,
                            transform: 'translateY(-2px)',
                            boxShadow: isLight
                                ? '0 4px 12px rgba(0,0,0,0.05)'
                                : '0 4px 12px rgba(0,0,0,0.2)',
                        },
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            backgroundColor: palette.paper,
                            '& fieldset': {
                                borderColor: palette.border,
                            },
                            '&:hover fieldset': {
                                borderColor: palette.textSecondary,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: palette.accent,
                                borderWidth: '1px',
                            },
                        },
                    },
                },
            },
        },
    });
};
