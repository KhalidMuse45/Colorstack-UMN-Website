import Nav from '@/components/ui/Nav';
import Footer from '@/components/ui/Footer';

/** The main site chrome. The join form brings its own nav over its hero photo. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
