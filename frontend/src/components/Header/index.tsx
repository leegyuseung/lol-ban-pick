import Link from 'next/link';
import Image from 'next/image';
import NavItem from './NavItem';

export default function Header() {
  return (
    <header>
      <div className="flex items-center justify-between px-20 h-16 bg-mainBlack">
        {/* 로고 */}
        <Link href="/" className="">
          <Image src="/metapick.png" alt="logo" width={64} height={64} />
        </Link>

        {/* 네비게이션 */}
        <nav className="flex space-x-6">
          <NavItem href={'/'} text={'시뮬레이터'} />
          <NavItem href={'/about'} text={'정보'} />
        </nav>
      </div>
    </header>
  );
}
