import { Metadata } from 'next';
import BanPickMain from './BanPickTeamMain';

export const metadata: Metadata = {
  title: 'MetaPick - 팀 모드',
  description: '팀모드 밴픽을 사용중입니다.',
  openGraph: {
    title: 'MetaPick - 팀 모드',
    description: '팀모드 밴픽을 사용중입니다.',
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
