//소켓 연결 페이지
'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useRulesStore, useSocketStore, useUserStore } from '@/store';
import { useSearchParams } from 'next/navigation';
import useBanpickSocket from '@/hooks/useBanpickSocket';
import { useRouter } from 'next/navigation';
function BanpickSocket({ userId: _userId }: { userId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  //room id
  const { roomId, setRoomId } = useSocketStore();
  //user id
  const { userId, setUserId } = useUserStore();
  const { ws, setWs, emitFunc } = useSocketStore();
  const { banpickMode, peopleMode, timeUnlimited, nowSet, audienceCount, position, role, hostInfo, guestInfo } =
    useRulesStore();
  const { setSocket } = useBanpickSocket({ userId: _userId, roomId });
  const onReady = () => {
    ws?.send(JSON.stringify({ type: 'ready', role, roomId }));
  };
  useEffect(() => {
    if (!searchParams?.get('roomId') && !roomId && role === 'host') {
      ws?.send(JSON.stringify({ type: 'noRoom' }));
    }
    setSocket();
  }, [role]);
  const goEnter = () => {
    router.push('/banpick');
    emitFunc(
      () =>
        ws?.send(
          JSON.stringify({
            type: 'start',
            userId: userId,
            roomId: roomId,
            host: !!searchParams!.get('roomId'),
          }),
        ),
      'blue',
    );
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
  const isHostReady = useMemo(() => hostInfo.status === 'ready', [hostInfo]);
  const isGuestReady = useMemo(() => guestInfo.status === 'ready', [guestInfo]);
  return (
    <>
      {true ? (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
          <h1 className="text-3xl font-bold text-center mb-8 text-yellow-400">대기방</h1>
          {JSON.stringify({
            userId,
            banpickMode,
            peopleMode,
            timeUnlimited,
            nowSet,
            audienceCount,
            position,
            role,
            hostInfo,
            guestInfo,
          })}
          <div className="grid grid-cols-3 gap-6 w-full max-w-4xl">
            {/* 블루팀 */}
            <div className="bg-blue-700 p-6 pt-3 rounded-lg shadow-lg border-2 border-blue-500">
              <div className="bg-yellow-500 text-white w-[30%] text-[12px] rounded-[5px] text-center">
                {isHostReady ? '준비 완료' : '준비 중'}
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
            <div className="bg-red-700 p-6 pt-3 rounded-lg shadow-lg border-2 border-red-500">
              <div className="bg-yellow-500 text-white w-[30%] text-[12px] rounded-[5px] text-center">
                {isGuestReady ? '준비 완료' : '준비 중'}
              </div>
              <h2 className="text-xl font-semibold">
                {redTeamName} ({redCount}/1)
              </h2>
              <p className="mt-2 text-sm text-gray-300">플레이어 2</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">게임이 곧 시작됩니다...</p>

            {role === 'host' || role === 'guest' ? (
              <button
                className="cursor-pointer h-8 px-8 text-mainText bg-mainGold font-medium text-xs rounded-sm hover:bg-opacity-65"
                onClick={onReady}
              >
                준비하기
              </button>
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
      ) : (
        <>
          <div>공유하기 roomId</div>
          <a
            href={`http://${process.env.NEXT_PUBLIC_SITE_URL}:3000/socketTest?roomId=${roomId}`}
            target="_blank"
            rel="noreferrer"
          >{`http://${process.env.NEXT_PUBLIC_SITE_URL}:3000/socketTest?roomId=${roomId}`}</a>
          <br />
          <br />
          <br />
          <div>banpickMode{banpickMode}</div>
          <div>peopleMode{peopleMode}</div> <div>timeUnlimited {timeUnlimited}</div>
          <div>nowSet {nowSet}</div>
          <div>position {position}</div>
          <div>role {role}</div>
          <div>hostInfo : {JSON.stringify(hostInfo)}</div>
          <div>guestInfo : {JSON.stringify(guestInfo)}</div>
          userId
          {userId ? <div>{userId}</div> : <></>}
          roomId
          {roomId ? <div>{roomId}</div> : <></>}
          <button onClick={onReady}>준비하기</button>
          <button onClick={goEnter}>시작하기</button>
        </>
      )}
    </>
  );
}

export default BanpickSocket;
