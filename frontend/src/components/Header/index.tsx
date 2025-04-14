import Link from 'next/link';
import Image from 'next/image';
import NavItem from './NavItem';

export default function Header() {
  return (
    <header>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3412811676948831"
        crossOrigin="anonymous"
      ></script>
      <div className="flex items-center justify-between px-20 h-16 bg-mainBlack">
        {/* 로고 */}
        <Link href="/" className="">
          <Image src="/metapick.png" alt="logo" width={64} height={64} />
        </Link>
        <Link href="/" className="">
          <p>지워야함</p>
          <Image src="/metapick.png" alt="logo" width={64} height={64} unoptimized />
        </Link>

        {/* 네비게이션 */}
        {/* TODO : 선택된 NavItem 표시하기 */}
        <nav className="flex space-x-6">
          <NavItem href={'/'} text={'밴픽 시뮬레이터'} />
        </nav>
      </div>
    </header>
  );
}
