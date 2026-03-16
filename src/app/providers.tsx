'use client';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from './context/ThemeContext';
import { getLightTheme, getDarkTheme } from './theme';
import { AuthProvider } from './context/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const muiTheme = theme === 'light' ? getLightTheme() : getDarkTheme();

  return (
    <AuthProvider>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </AuthProvider>
  );
}
