//공유하는 컴포넌트

'use client';
import React, { useEffect } from 'react';

import { useSocketStore, useRulesStore } from '@/store';
import Link from 'next/link';
interface PropType {
  closePopup: () => void;
}
function SharePopup({ closePopup }: PropType) {
  //랜덤
  const randomId = Math.random().toString(36).substr(2, 20);
  const { setRoomId } = useSocketStore();
    const { myTeamSide } = useRulesStore();
  //room id 설정
  useEffect(() => {
    setRoomId(randomId);
  }, []);
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
        <div className="flex flex-col justify-center items-center bg-mainBlack rounded-lg w-[1100px] h-[200px] gap-5">
          <div className="flex flex-col gap-10">
            <div>공유하기 roomId{myTeamSide === "red" ? "블루팀 공유" : "레드팀 공유"}{myTeamSide+"myTeamSide"}</div>
            <div>관전자 공유</div>
            <div className="flex flex-row justify-center items-center">
              <Link
                className="text-center font-semibold w-[200px] p-3 border border-mainText text-mainText rounded-md hover:bg-gray-500 transition"
                href={'/socketTest'}
              >
                이동
              </Link>
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
