//소켓 연결 페이지
'use client';
import React, { useEffect, useRef, useState } from 'react';

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
  const { ws, setWs, executeFun } = useSocketStore();
  const { hostInfo, guestInfo } = useRulesStore();
  useBanpickSocket({ userId: _userId, roomId, isHost: false });
  // useEffect(() => {
  //   console.log(ws);
  //   if (ws && ws.readyState === WebSocket.CONNECTING) {
  //     ws?.send(JSON.stringify({ type: 'init', userId: userId, roomId: roomId, ...rules }));
  //   }
  // }, [ws, ws?.readyState]);
  const onReady = () => {
    //현재 설정된 게임의 룰 을 전송
    executeFun(() => ws?.send(JSON.stringify({ type: 'ready', userId: userId, roomId: roomId, ...rules })), 'red');
  };
  const goEnter = () => {
    router.push("/banpick")
    executeFun(
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
  return (
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
      <div>hostInfo : {JSON.stringify(hostInfo)}</div>
      <div>guestInfo : {JSON.stringify(guestInfo)}</div>
      userId
      {userId ? <div>{userId}</div> : <></>}
      roomId
      {roomId ? <div>{roomId}</div> : <></>}
      <button onClick={onReady}>준비하기</button>
      <button onClick={goEnter}>시작하기</button>
    </>
  );
}

export default BanpickSocket;
