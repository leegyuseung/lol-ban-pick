//소켓 연결 페이지
'use client';
import React, { useEffect, useRef, useState } from 'react';

import { useRulesStore, useSocketStore, useUserStore } from '@/store';
import { useSearchParams } from 'next/navigation';
function BanpickSocket({ userId: _userId }: { userId: string }) {
  const searchParams = useSearchParams();
  //room id
  const { roomId, setRoomId } = useSocketStore();
  //user id
  const { userId, setUserId } = useUserStore();
  const { ws, setWs, executeFun, rules, host } = useSocketStore();
  const { myTeamSide } = useRulesStore();
  const socketRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    // WebSocket이 연결되지 않으면 새로 연결 시도
    if (ws) return;
    if (!socketRef.current) {
      const userId = _userId;
      setUserId(userId);
      const connectWebSocket = async () => {
        //파람으로 (공유 url)로 roomId get
        if (searchParams!.get('roomId')) setRoomId(searchParams!.get('roomId') as string);

        const response = await fetch(
          `/api/socket/io?roomId=${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}&userId=${userId}&side=${searchParams!.get('side') ? searchParams!.get('side') : myTeamSide}`,
        ); // WebSocket 서버 확인 요청
        if (!response.ok) throw new Error('WebSocket server not ready');
        const _ws = new WebSocket(
          `ws://${process.env.NEXT_PUBLIC_SITE_URL}:3001?roomId=${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}&userId=${userId}&side=${searchParams!.get('side') ? searchParams!.get('side') : myTeamSide}`,
        );
        setWs(_ws); // WebSocket 서버 주소로 변경

        _ws.onopen = () =>
          console.log(
            '✅ WebSocket connected' +
              `userId${userId}roomId` +
              `${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}`,
          );

        _ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          // 메시지 타입에 따라 알림을 띄움
          // 페이지 별로 이벤트 추가 필요

          if (data.type === 'ready') {
            console.log(`📩 새 메시지: ${JSON.stringify(data)}`);
          }
        };

        _ws.onerror = (error) => console.error('❌ WebSocket error:', error);
        _ws.onclose = () => console.log('❌ WebSocket disconnected');

        socketRef.current = _ws;
      };

      connectWebSocket();
    }
  }, [roomId]);
  const onReady = () => {
    //현재 설정된 게임의 룰 을 전송
    executeFun(
      () =>
        socketRef.current?.send(
          JSON.stringify({ type: 'ready', userId: userId, roomId: roomId, ...rules }), 
        ),
      'blue',
    );
  };
  const goEnter = () => {
    executeFun(
      () =>
        socketRef.current?.send(
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
