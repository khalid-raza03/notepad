import { createContext, useContext } from 'react';
import type { PaletteMode } from '@mui/material';

type ThemeContextType = {
    mode: PaletteMode;
    toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
    mode: 'light',
    toggleTheme: () => { },
});

export const useThemeContext = () => useContext(ThemeContext);
