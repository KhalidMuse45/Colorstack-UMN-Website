import type { Metadata } from 'next';
import { Archivo, Lora, IBM_Plex_Mono } from 'next/font/google';
import SmoothScroll from '@/components/motion/SmoothScroll';
import Nav from '@/components/ui/Nav';
import PageIndex from '@/components/ui/PageIndex';
import Footer from '@/components/ui/Footer';
import './globals.css';

/*
 * Archivo and Lora are variable fonts, so no `weight` is passed.
 *
 * FIXED: both used to declare `weight: ['700','800','900']` and
 * `weight: ['400','500','600']`. Asking a variable font for an explicit weight
 * list makes next/font fetch a separate STATIC instance per weight per style:
 * three files for Archivo, six for Lora, and eleven across the three families.
 * At that point next/font emits no `<link rel="preload" as="font">` at all, so
 * the browser did not learn the fonts existed until it had parsed the CSS.
 *
 * Measured cost, mobile emulation on Slow 4G with 4x CPU: CLS 0.13 on a cold
 * cache and 0.00 once the fonts were cached. The whole shift was the swap
 * arriving late and re-wrapping the bottom-anchored hero copy.
 *
 * Dropping `weight` gives one variable file per family per style, which is
 * what next/font preloads. The weights the brand rules ask for (Archivo
 * 700-900, Lora 400-600) are all inside each font's variable axis, so nothing
 * about the design changes.
 */
const display = Archivo({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
});

/** The italic lede is a signature, so Lora ships both styles. */
const body = Lora({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
});

/**
 * Meta. IBM Plex Mono 400 and 500, and the whole list of places it is allowed:
 * the gutter index numbers, `[ Menu ]`, the spec-sheet keys, and the footer.
 */
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  // Plex Mono is not variable, so this one genuinely needs its weights named.
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
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
