import { Suspense } from 'react';
import { Metadata } from 'next';
import { images } from '@/constants';
import BanpickSocket from '@/app/socketRoom/banpickSocket';
import Loading from '@/components/Loading';

export const metadata: Metadata = {
  title: 'MetaPick(메타픽) - 밴픽 대기방',
  description: '팀모드 밴픽 대기방입니다.',
  openGraph: {
    title: 'MetaPick(메타픽) - 밴픽 대기방',
    description: '팀모드 밴픽 대기방입니다.',
    images: [images.THUMBNAIL],
    url: `${process.env.NEXT_PUBLIC_URL}/socketRoom`,
    type: 'website',
    siteName: 'MetaPick(메타픽)',
  },
};

// socketRoom 페이지
function BanpickSocketWrapper() {
  // 전달된 userId가 없으면 랜덤 값 생성
  const generatedUserId = `${Math.floor(Math.random() * 100000000)}`;

  return (
    <Suspense fallback={<Loading />}>
      <BanpickSocket userId={generatedUserId} />
    </Suspense>
  );
}

export default BanpickSocketWrapper;
