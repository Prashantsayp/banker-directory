import { FC, useState, createContext, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { themeCreator } from './base';

export const ThemeContext = createContext(
  (_themeName: string): void => {}
);

const ThemeProviderWrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeNameState] = useState('NebulaFighterTheme');

  useEffect(() => {
    const curThemeName =
      window.localStorage.getItem('appTheme') || 'NebulaFighterTheme';
    setThemeNameState(curThemeName);
  }, []);

  const theme = themeCreator(themeName);

  const setThemeName = (name: string): void => {
    window.localStorage.setItem('appTheme', name);
    setThemeNameState(name);
  };

  return (
    <ThemeContext.Provider value={setThemeName}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProviderWrapper;
