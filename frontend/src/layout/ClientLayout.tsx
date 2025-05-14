'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { KakaoAdLeft, KakaoAdRight } from '@/components/KaKaoAd';
import { navigations } from '@/constants';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showHeader = pathname === navigations.SIMULATION || pathname.startsWith(navigations.INFORMATION);
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <KakaoAdLeft />}
      {showHeader && <KakaoAdRight />}

      {showHeader && <Header />}
      <main className="flex-grow">{children}</main>
      {showHeader && <Footer />}
    </div>
  );
}
