import Form from '@/components/FormRow';
import Header from '@/components/Header';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'MetaPick - 롤 밴픽 시뮬레이터',
  description: '리그오브레전드의 밴픽을 자유롭게 시뮬레이션할 수 있는 MetaPick!',
  openGraph: {
    title: 'MetaPick - 롤 밴픽 시뮬레이터',
    description: '리그오브레전드의 밴픽을 자유롭게 시뮬레이션할 수 있는 MetaPick!',
    images: ['/favicon.png'],
    url: 'https://metapick.vercel.app',
  },
};

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />

      <Suspense>
        <Form />
      </Suspense>
      {/* 개선 예정 */}
      {/* <SocketExit/> */}
    </div>
  );
}
