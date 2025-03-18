//공유하는 컴포넌트

'use client';
import React, { SyntheticEvent, useEffect } from 'react';

import { useSocketStore, useRulesStore } from '@/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
interface PropType {
  closePopup: () => void;
}
function SharePopup({ closePopup }: PropType) {
  //랜덤
  const randomId = Math.random().toString(36).substr(2, 20);
  const router = useRouter();
  const { ws, closeWs } = useSocketStore();
  const { roomId, setRoomId, setHost } = useSocketStore();
  const { myTeamSide } = useRulesStore();
  //room id 설정
  useEffect(() => {
    setRoomId(randomId);
  }, []);
  const copyText = (e: SyntheticEvent) => {
    navigator.clipboard.writeText((e.target as HTMLElement).innerText);
  };
  const goBanpick = () => {
    setHost(false);
    router.push('/socketTest');
  };
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
        <div className="flex flex-col justify-center items-center bg-mainBlack rounded-lg w-[1100px] h-[200px] gap-5">
          <div className="flex flex-col gap-10">
            <div>
              공유하기 roomId{myTeamSide === 'red' ? '블루팀 공유' : '레드팀 공유'}
              {myTeamSide + 'myTeamSide'}
            </div>
            <div
              onClick={copyText}
            >{`http://${process.env.NEXT_PUBLIC_SITE_URL}:3000/banpick?roomId=${roomId}&side=${myTeamSide === 'red' ? 'blue' : 'red'}`}</div>
            <div>관전자 공유</div>
            <div
              onClick={copyText}
            >{`http://${process.env.NEXT_PUBLIC_SITE_URL}:3000/banpick?roomId=${roomId}&side=audience`}</div>
            <div className="flex flex-row justify-center items-center">
              <button
                className="text-center font-semibold w-[200px] p-3 border border-mainText text-mainText rounded-md hover:bg-gray-500 transition"
                onClick={goBanpick}
              >
                이동
              </button>
              <button
                className="font-semibold w-[200px] p-3 border border-mainText text-mainText rounded-md hover:bg-gray-500 transition"
                onClick={closePopup}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SharePopup;
