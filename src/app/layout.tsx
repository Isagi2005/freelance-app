'use client';

import './globals.css';
import { ThemeProvider } from './context/ThemeContext';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>ClientFlow - CRM for Freelancers</title>
        <meta name="description" content="Lightweight CRM for freelancers and web developers" />
      </head>
      <body>
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
