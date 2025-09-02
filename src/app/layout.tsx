import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Flappy Bird - Customizable Game',
  description: 'A customizable Flappy Bird game with multiple themes, difficulty levels, and bird customization options.',
  keywords: ['flappy bird', 'game', 'customizable', 'browser game', 'html5 game'],
  authors: [{ name: 'Flappy Bird Game' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}