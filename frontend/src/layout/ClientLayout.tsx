'use client';

import Header from '@/components/Header';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showHeader = pathname === '/' || pathname.startsWith('/about');
  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  );
}
