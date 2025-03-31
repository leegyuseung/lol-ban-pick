import { Suspense } from 'react';
import BanpickSocket from './banpickSocket';
import Loading from '@/components/Loading';

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
