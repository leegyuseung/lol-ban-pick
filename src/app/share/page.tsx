//공유하는 컴포넌트

'use client';
import React, { useEffect, useRef, useState } from 'react';

import { useSocketStore, useUserStore } from '@/store';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
function page() {
  const randomId = Math.random().toString(36).substr(2, 20);
  const { roomId, setRoomId } = useSocketStore();
  const { userId, setUserId } = useUserStore();
  //room id 설정
  useEffect(() => {
    setRoomId(randomId);
  }, []);
  return (
    <>
      <div>공유하기 roomId</div>
      <div>{`http://${process.env.NEXT_PUBLIC_SITE_URL}:3000`}</div>
      <Link href={'/socketTest'}>이동</Link>
    </>
  );
}

export default page;
