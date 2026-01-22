import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PersonalizeProvider } from '@/lib/personalize';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PersonalizeProvider>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </PersonalizeProvider>
  );
}
