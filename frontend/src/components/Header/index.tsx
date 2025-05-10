import Image from 'next/image';
import Link from 'next/link';
import NavItem from '@/components/Header/NavItem';
import { images, navigations } from '@/constants';

const Nav = [
  { url: navigations.SIMULATION, name: '시뮬레이터' },
  { url: navigations.INFORMATION, name: '정보' },
];

export default function Header() {
  return (
    <header className="fixed top-0 w-full">
      <div className="flex items-center justify-between px-4 md:px-20 h-16 bg-mainBlack min-w-[320px]">
        {/* 로고 */}
        <Link href={navigations.SIMULATION}>
          <Image
            src={images.THUMBNAIL}
            alt="MetaPick_메타픽_logo"
            width={64}
            height={64}
            className="object-contain w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
            priority
          />
        </Link>

        {/* 네비게이션 */}
        <nav className="flex justify-center items-center space-x-6">
          {Nav.map((nav, index) => (
            <NavItem key={index} href={nav.url} text={nav.name} />
          ))}
        </nav>
      </div>
    </header>
  );
}
