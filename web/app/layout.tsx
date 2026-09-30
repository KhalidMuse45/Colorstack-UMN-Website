import type { Metadata } from 'next';
import { Archivo, Caveat, IBM_Plex_Mono, Lora } from 'next/font/google';
import ScrollReveal from '@/components/motion/ScrollReveal';
import { ASSETS_BASE } from '@/lib/image';
import './globals.css';

// Preload only the Latin font used by the first-screen navigation and heading.
const display = Archivo({ subsets: ['latin'], variable: '--font-display', display: 'swap', preload: true });
const body = Lora({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-body', display: 'swap', preload: false });
// Sticky-note labels and handwritten sign-offs (Pencil: Get in Touch Note, Join Form).
const plex = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex', display: 'swap', preload: false });
const hand = Caveat({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-hand', display: 'swap', preload: false });

export const metadata: Metadata = {
  metadataBase: new URL('https://colorstackumn.org'),
  title: 'ColorStack UMN',
  description: 'A home for Black and Latinx computer science students at the University of Minnesota.',
  icons: { icon: `${ASSETS_BASE}/images/colorstack-umn-mark-192.webp` },
  openGraph: { title: 'ColorStack UMN', description: 'Find your people. Build what comes next.', images: [{ url: `${ASSETS_BASE}/images/responsive/red-scarf-portrait-1200.webp`, width: 1200, height: 1500, alt: 'ColorStack UMN member wearing the chapter red scarf' }] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${plex.variable} ${hand.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('reveal-ready');" }} />
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
        <ScrollReveal />
      </body>
    </html>
  );
}
