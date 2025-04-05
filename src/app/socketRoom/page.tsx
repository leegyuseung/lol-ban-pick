import { Suspense } from 'react';
import { Metadata } from 'next';
import BanpickSocket from './banpickSocket';
import Loading from '@/components/Loading';

export const metadata: Metadata = {
  title: 'MetaPick - 대기방',
  description: '팀모드 대기방입니다.',
  openGraph: {
    title: 'MetaPick - 대기방',
    description: '팀모드 대기방입니다.',
    images: ['/favicon.png'],
    url: 'https://metapick.vercel.app',
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
