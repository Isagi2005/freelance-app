'use client';

import { createTheme } from '@mui/material/styles';

export const getLightTheme = () =>
  createTheme({
    palette: {
      mode: 'light',
      background: {
        default: '#f9fafb',
        paper: '#ffffff',
      },
      text: {
        primary: '#111827',
        secondary: '#374151',
      },
      primary: {
        main: '#6366f1',
        light: '#818cf8',
        dark: '#4f46e5',
      },
      secondary: {
        main: '#ec4899',
        light: '#f472b6',
        dark: '#db2777',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
  });

export const getDarkTheme = () =>
  createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#020617',
        paper: '#0f172a',
      },
      text: {
        primary: '#f1f5f9',
        secondary: '#e2e8f0',
      },
      primary: {
        main: '#818cf8',
        light: '#a5b4fc',
        dark: '#6366f1',
      },
      secondary: {
        main: '#f472b6',
        light: '#f9a8d4',
        dark: '#ec4899',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: '#1e293b',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.1)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#0f172a',
          },
        },
      },
    },
  });
