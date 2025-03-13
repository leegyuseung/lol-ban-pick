import Link from 'next/link';
import Image from 'next/image';
import NavItem from './NavItem';

export default function Header() {
  return (
    <header>
      <div className="flex items-center justify-between px-20 h-16 bg-mainBlack">
        {/* 로고 */}
        <Link href="/" className="">
          <Image src="/images/riot2.png" alt="logo" width={40} height={40} />
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
