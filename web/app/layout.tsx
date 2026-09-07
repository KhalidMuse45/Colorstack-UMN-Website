import type { Metadata } from 'next';
import { Archivo, Lora } from 'next/font/google';
import Nav from '@/components/ui/Nav';
import Footer from '@/components/ui/Footer';
import './globals.css';

// Preload only the Latin font used by the first-screen navigation and heading.
const display = Archivo({ subsets: ['latin'], variable: '--font-display', display: 'swap', preload: true });
const body = Lora({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-body', display: 'swap', preload: false });

export const metadata: Metadata = {
  metadataBase: new URL('https://colorstackumn.org'),
  title: 'ColorStack UMN',
  description: 'A home for Black and Latinx computer science students at the University of Minnesota.',
  openGraph: { title: 'ColorStack UMN', description: 'Find your people. Build what comes next.', images: [{ url: '/images/summit-group-1600.webp', width: 1600, height: 1200 }] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
