import * as React from 'react';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

// Define color palettes
const lightColors = {
  background: '#fff',
  text: '#222',
  card: '#f4f6fa',
  primary: '#ff8418',
  secondary: '#0073d8',
  border: '#e0e0e0',
};

const darkColors = {
  background: '#181a20',
  text: '#fff',
  card: '#23262f',
  primary: '#ff8418',
  secondary: '#0073d8',
  border: '#23262f',
};

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextProps {
  theme: ThemeType;
  colorScheme: ColorSchemeName;
  colors: typeof lightColors;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('system');
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    if (theme === 'system') {
      const listener = Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
      });
      setColorScheme(Appearance.getColorScheme());
      return () => listener.remove();
    } else {
      setColorScheme(theme);
    }
  }, [theme]);

  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}; 