//소켓 연결 페이지
'use client';
import React, { useEffect, useRef, useState } from 'react';

import { useSocketStore, useUserStore } from '@/store';
import { useSearchParams } from 'next/navigation';
function BanpickSocket({ userId: _userId }: { userId: string }) {
  const searchParams = useSearchParams();
  //room id
  const { roomId, setRoomId } = useSocketStore();
  //user id
  const { userId, setUserId } = useUserStore();

  const [ws, setWs] = useState<WebSocket | null>(null);
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
          `/api/socket/io?roomId=${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}&userId=${userId}`,
        ); // WebSocket 서버 확인 요청
        if (!response.ok) throw new Error('WebSocket server not ready');
        const _ws = new WebSocket(
          `ws://${process.env.NEXT_PUBLIC_SITE_URL}:3001?roomId=${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}&userId=${userId}`,
        );
        setWs(() => _ws); // WebSocket 서버 주소로 변경

        _ws.onopen = () =>
          console.log(
            '✅ WebSocket connected' +
              `userId${userId}roomId` +
              `${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}`,
          );

        _ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('📩 받은 메시지:', data);

          // 메시지 타입에 따라 알림을 띄움
          // 페이지 별로 이벤트 추가 필요
          if (data.type === 'private') {
            console.log(`📩 새 메시지: ${data.message}`); // 다른 창에서 메시지를 받으면 alert
          }
        };

        _ws.onerror = (error) => console.error('❌ WebSocket error:', error);
        _ws.onclose = () => console.log('❌ WebSocket disconnected');

        socketRef.current = _ws;
      };

      connectWebSocket();
    }

    return () => {
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [roomId]);
  const goEnter = () => {
    socketRef.current?.send(
      JSON.stringify({ type: 'private', userId: userId, roomId: roomId, message: 'test' }), // ✅ `to` 필드 추가
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
      userId
      {userId ? <div>{userId}</div> : <></>}
      roomId
      {roomId ? <div>{roomId}</div> : <></>}
      <button onClick={goEnter}>시작하기</button>
    </>
  );
}

export default BanpickSocket;
