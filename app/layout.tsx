'use client';

import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { ThemeProvider } from './context/ThemeProvider';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Initialize stagewise toolbar in development mode only
    if (process.env.NODE_ENV === 'development') {
      import('@stagewise/toolbar').then(({ initToolbar }) => {
        initToolbar({
          plugins: []
        });
      }).catch(err => {
        console.error('Failed to load stagewise toolbar:', err);
      });
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>ClarVal - Professional Stock Analysis</title>
        <meta
          name="description"
          content="Professional stock analysis and portfolio management tools for individual investors."
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {mounted ? (
            children
          ) : (
            <div style={{ visibility: 'hidden' }}>{children}</div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
