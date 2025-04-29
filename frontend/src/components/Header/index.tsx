import Link from 'next/link';
import Image from 'next/image';
import NavItem from '@/components/Header/NavItem';
import { images, navigations } from '@/constants';

const Nav = [
  { url: navigations.SIMULATION, name: '시뮬레이터' },
  { url: navigations.INFORMATION, name: '정보' },
];

export default function Header() {
  return (
    <header className="h-16">
      <div className="flex items-center justify-between px-20 h-16 bg-mainBlack">
        {/* 로고 */}
        <Link href="/" className="">
          <Image src={images.THUMBNAIL} alt="logo" width={64} height={64} />
        </Link>

        {/* 네비게이션 */}
        <nav className="flex space-x-6">
          {Nav.map((nav, index) => (
            <NavItem key={index} href={nav.url} text={nav.name} />
          ))}
        </nav>
      </div>
    </header>
  );
}
