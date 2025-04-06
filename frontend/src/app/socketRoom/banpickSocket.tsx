//소켓 연결 페이지
'use client';
import React, { useEffect, useMemo } from 'react';
import { useRulesStore, useSocketStore } from '@/store';
import { useSearchParams } from 'next/navigation';
import useBanpickSocket from '@/hooks/useBanpickSocket';
import Image from 'next/image';

function BanpickSocket({ userId: _userId }: { userId: string }) {
  const searchParams = useSearchParams();
  //room id
  const { roomId } = useSocketStore();
  //user id
  const { ws } = useSocketStore();
  const { audienceCount, role, hostInfo, guestInfo } = useRulesStore();
  const { setSocket } = useBanpickSocket({ userId: _userId, roomId });
  const onReady = () => {
    ws?.send(JSON.stringify({ type: 'ready', role, roomId }));
  };
  const onCancel = () => {
    ws?.send(JSON.stringify({ type: 'readyCancel', role, roomId }));
  };
  useEffect(() => {
    if (!searchParams?.get('roomId') && !roomId && role === 'host') {
      ws?.send(JSON.stringify({ type: 'noRoom' }));
    }
    setSocket();
  }, [role]);
  const goEnter = () => {
    ws?.send(JSON.stringify({ type: 'banpickStart', roomId }));
  };
  const redCount = useMemo(() => {
    const teamSide = hostInfo.myTeamSide === 'red' ? hostInfo : guestInfo;
    return !teamSide || !teamSide.status || !['join', 'ready'].includes(teamSide.status) ? 0 : 1;
  }, [guestInfo, hostInfo]);
  const blueCount = useMemo(() => {
    const teamSide = hostInfo.myTeamSide === 'blue' ? hostInfo : guestInfo;

    return !teamSide || !teamSide.status || !['join', 'ready'].includes(teamSide.status) ? 0 : 1;
  }, [guestInfo, hostInfo]);
  const redTeamName = useMemo(() => {
    const teamSide = hostInfo.myTeamSide === 'red' ? hostInfo : guestInfo;
    return teamSide.myTeam;
  }, [guestInfo, hostInfo]);
  const blueTeamName = useMemo(() => {
    const teamSide = hostInfo.myTeamSide === 'blue' ? hostInfo : guestInfo;

    return teamSide.myTeam;
  }, [guestInfo, hostInfo]);

  const blueTeamImg = useMemo(() => {
    const teamSide = hostInfo.myTeamSide === 'blue' ? hostInfo : guestInfo;

    return teamSide.myImg ? teamSide.myImg : '/images/t1.webp';
  }, [guestInfo, hostInfo]);
  const redTeamImg = useMemo(() => {
    const teamSide = hostInfo.myTeamSide === 'red' ? hostInfo : guestInfo;

    return teamSide.myImg ? teamSide.myImg : '/images/hanwha.webp';
  }, [guestInfo, hostInfo]);
  const isHostReady = useMemo(() => hostInfo.status === 'ready', [hostInfo]);
  const isGuestReady = useMemo(() => guestInfo.status === 'ready', [guestInfo]);
  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-yellow-400">대기방</h1>

        <div className="grid grid-cols-3 gap-6 w-full max-w-4xl">
          {/* 블루팀 */}
          <div
            className={`${isHostReady ? 'bg-blue-700' : 'bg-blue-500'} p-6 pt-3 rounded-lg shadow-lg border-2 border-blue-500`}
          >
            <div
              className={`${isHostReady ? 'bg-yellow-500' : 'bg-gray-500'} text-white w-[30%] text-[12px] rounded-[5px] text-center`}
            >
              {isHostReady ? '준비 완료' : '준비 중'}
            </div>
            <div className="relative w-full h-[200px]">
              <Image
                className="object-contain"
                sizes="w-[200px] h-[200px]"
                src={blueTeamImg}
                alt="logo"
                fill
                priority
              />
            </div>
            <h2 className="text-xl font-semibold">
              {blueTeamName} ({blueCount}/1)
            </h2>
            <p className="mt-2 text-sm text-gray-300">플레이어 1</p>
          </div>
          {/* 관전자 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-gray-600">
            <h2 className="text-xl font-semibold">관전자 (무제한)</h2>
            <p className="mt-2 text-sm text-gray-300">현재 접속자: {audienceCount}명</p>
          </div>

          {/* 레드팀 */}
          <div
            className={`${isGuestReady ? 'bg-red-700' : 'bg-red-500'} p-6 pt-3 rounded-lg shadow-lg border-2 border-red-500`}
          >
            <div
              className={`${isGuestReady ? 'bg-yellow-500' : 'bg-gray-500'} text-white w-[30%] text-[12px] rounded-[5px] text-center`}
            >
              {isGuestReady ? '준비 완료' : '준비 중'}
            </div>
            <div className="relative w-full h-[200px]">
              <Image className="object-contain" sizes="w-[200px] h-[200px]" src={redTeamImg} alt="logo" fill priority />
            </div>
            <h2 className="text-xl font-semibold">
              {redTeamName} ({redCount}/1)
            </h2>
            <p className="mt-2 text-sm text-gray-300">플레이어 2</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">게임이 곧 시작됩니다...</p>
          <div className="flex w-[300px] justify-evenly mt-5">
            {role === 'host' || role === 'guest' ? (
              (role === 'host' && isHostReady) || (role === 'guest' && isGuestReady) ? (
                <button
                  className="cursor-pointer h-8 px-8 text-mainText bg-orange-700 font-medium text-xs rounded-sm hover:bg-opacity-65"
                  onClick={onCancel}
                >
                  준비취소하기
                </button>
              ) : (
                <button
                  className="cursor-pointer h-8 px-8 text-mainText bg-mainGold font-medium text-xs rounded-sm hover:bg-opacity-65"
                  onClick={onReady}
                >
                  준비하기
                </button>
              )
            ) : (
              <></>
            )}
            {role === 'host' ? (
              <button
                className={`${!isHostReady || !isGuestReady ? 'cursor-not-allowed' : 'cursor-pointer'} h-8 px-8 text-mainText bg-mainGold font-medium text-xs rounded-sm hover:bg-opacity-65`}
                onClick={goEnter}
                disabled={!isHostReady || !isGuestReady}
              >
                시작하기
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default BanpickSocket;
