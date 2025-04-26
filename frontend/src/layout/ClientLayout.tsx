'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showHeader = pathname === '/' || pathname.startsWith('/about');
  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && <Header />}
      <main className="flex-grow">{children}</main>
      {showHeader && <Footer />}
    </div>
  );
}
