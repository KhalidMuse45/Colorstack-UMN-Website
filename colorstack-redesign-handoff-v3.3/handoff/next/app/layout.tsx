import type { Metadata } from 'next';
import { Archivo, Lora, IBM_Plex_Mono } from 'next/font/google';
import SmoothScroll from '@/components/motion/SmoothScroll';
import Nav from '@/components/ui/Nav';
import './globals.css';

const display = Archivo({ subsets: ['latin'], weight: ['700', '800', '900'], variable: '--font-display', display: 'swap' });
const body = Lora({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-body', display: 'swap' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

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
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
