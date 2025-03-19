//소켓 연결 페이지
'use client';
import React, { useEffect, useRef, useState } from 'react';

import { useRulesStore, useSocketStore, useUserStore } from '@/store';
import { useSearchParams } from 'next/navigation';
import useBanpickSocket from '@/hooks/useBanpickSocket';
function BanpickSocket({ userId: _userId }: { userId: string }) {
  const searchParams = useSearchParams();
  //room id
  const { roomId, setRoomId } = useSocketStore();
  //user id
  const { userId, setUserId } = useUserStore();
  const { ws, setWs, executeFun, rules, host } = useSocketStore();
  const { myTeamSide } = useRulesStore();
  useBanpickSocket({ userId: _userId, roomId, isHost:false });
  // useEffect(() => {
  //   console.log(ws);
  //   if (ws && ws.readyState === WebSocket.CONNECTING) {
  //     ws?.send(JSON.stringify({ type: 'init', userId: userId, roomId: roomId, ...rules }));
  //   }
  // }, [ws, ws?.readyState]);
  const onReady = () => {
    //현재 설정된 게임의 룰 을 전송
    executeFun(() => ws?.send(JSON.stringify({ type: 'ready', userId: userId, roomId: roomId, ...rules })), 'blue');
  };
  const goEnter = () => {
    executeFun(
      () =>
        ws?.send(
          JSON.stringify({ type: 'start', userId: userId, roomId: roomId, ...rules, host, message: 'test' }), // ✅ `to` 필드 추가
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
      <div>{JSON.stringify(rules)}</div>
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
