import { Metadata } from 'next';
import { images } from '@/constants';
import BanPickMain from '@/app/banpickTeam/BanPickTeamMain';

export const metadata: Metadata = {
  title: 'MetaPick - 팀 모드',
  description: '팀모드 밴픽을 사용중입니다.',
  openGraph: {
    title: 'MetaPick - 팀 모드',
    description: '팀모드 밴픽을 사용중입니다.',
    images: [images.THUMBNAIL],
    url: process.env.NEXT_PUBLIC_URL,
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
