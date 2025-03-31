import { Suspense } from 'react';
import BanpickSocket from './banpickSocket';

// socketRoom 페이지
function BanpickSocketWrapper() {
  // 전달된 userId가 없으면 랜덤 값 생성
  const generatedUserId = `${Math.floor(Math.random() * 100000000)}`;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BanpickSocket userId={generatedUserId} />
    </Suspense>
  );
}

export default BanpickSocketWrapper;
