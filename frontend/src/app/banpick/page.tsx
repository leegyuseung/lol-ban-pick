import { Metadata } from 'next';
import { images } from '@/constants';
import BanPickMain from '@/app/banpick/BanPickMain';

export const metadata: Metadata = {
  title: 'MetaPick(메타픽) - 솔로 모드',
  description: '솔로모드 밴픽을 사용중입니다.',
  openGraph: {
    title: 'MetaPick(메타픽) - 솔로 모드',
    description: '솔로모드 밴픽을 사용중입니다.',
    images: [images.THUMBNAIL],
    url: `${process.env.NEXT_PUBLIC_URL}/banpick`,
    type: 'website',
    siteName: 'MetaPick(메타픽)',
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
