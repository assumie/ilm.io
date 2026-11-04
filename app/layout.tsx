import './globals.css';
import type { Metadata } from 'next';
import { Lexend, Atkinson_Hyperlegible } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AppShell } from '@/components/app-shell';

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});

const atkinson = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-atkinson',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ilm.io — One upload. Many ways to learn.',
  description:
    'An AI teaching assistant for Malaysian classrooms that turns one teacher-uploaded lesson into several accessible learning formats for neurodivergent and special-needs students.',
  openGraph: {
    title: 'ilm.io — One upload. Many ways to learn.',
    description:
      'An AI teaching assistant for Malaysian classrooms. One upload, many ways to learn.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${lexend.variable} ${atkinson.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Young+Serif&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider defaultTheme="light">
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
