'use client';

import * as React from 'react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider as EmotionCacheProvider } from '@emotion/react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from './context/ThemeContext';
import { getLightTheme, getDarkTheme } from './theme';
import { AuthProvider } from './context/AuthContext';

// This implementation is from emotion's examples with Next.js App Router
// https://github.com/emotion-js/emotion/blob/main/packages/react/__tests__/css.js
function useEmotionCache() {
  const cache = React.useMemo(() => {
    const cache = createCache({ key: 'mui', prepend: true });
    cache.compat = true;
    return cache;
  }, []);

  useServerInsertedHTML(() => {
    const names = Object.keys(cache.inserted);
    if (names.length === 0) {
      return null;
    }
    const styles = names.map((name) => {
      return cache.inserted[name];
    });
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles.join(''),
        }}
      />
    );
  });

  return cache;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const cache = useEmotionCache();
  const { theme } = useTheme();
  const muiTheme = theme === 'light' ? getLightTheme() : getDarkTheme();

  return (
    <EmotionCacheProvider value={cache}>
      <AuthProvider>
        <MuiThemeProvider theme={muiTheme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </AuthProvider>
    </EmotionCacheProvider>
  );
}
