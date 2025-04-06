import { Metadata } from 'next';
import BanPickMain from './BanPickMain';

export const metadata: Metadata = {
  title: 'MetaPick - 솔로 모드',
  description: '솔로모드 밴픽을 사용중입니다.',
  openGraph: {
    title: 'MetaPick - 솔로 모드',
    description: '솔로모드 밴픽을 사용중입니다.',
    images: ['/favicon.png'],
    url: 'https://metapick.vercel.app',
  },
};

function Banpick() {
  return (
    <>
      <BanPickMain />
    </>
  );
}

export default Banpick;
