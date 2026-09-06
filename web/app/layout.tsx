import type { Metadata } from 'next';
import { Archivo, Lora, IBM_Plex_Mono } from 'next/font/google';
import SmoothScroll from '@/components/motion/SmoothScroll';
import Nav from '@/components/ui/Nav';
import PageIndex from '@/components/ui/PageIndex';
import Footer from '@/components/ui/Footer';
import './globals.css';

/** Display. Archivo 700 to 900, per 01-BRAND-RULES. */
const display = Archivo({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});

/** Body. Lora 400 to 600 with italics, because the italic lede is a signature. */
const body = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
});

/**
 * Meta. IBM Plex Mono 400 and 500, and the whole list of places it is allowed:
 * the gutter index numbers, `[ Menu ]`, the spec-sheet keys, and the footer.
 */
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ColorStack UMN',
  description: 'A home for Black and Latinx computer science students at the University of Minnesota.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <SmoothScroll>
          <Nav />
          <PageIndex />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
