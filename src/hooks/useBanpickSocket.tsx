import React, { useEffect, useRef, useState } from 'react';

import { useRulesStore, useSocketStore, useUserStore } from '@/store';
import { useSearchParams } from 'next/navigation';
function useBanpickSocket({ userId: _userId, roomId, isHost }: { userId: string; roomId: string; isHost: boolean }) {
  const searchParams = useSearchParams();
  //room id
  const { setRoomId } = useSocketStore();
  //user id
  const { userId, setUserId } = useUserStore();
  const { ws, setWs, executeFun, rules, host } = useSocketStore();
  const { myTeamSide, setRules } = useRulesStore();
  const socketRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    // WebSocket이 연결되지 않으면 새로 연결 시도
    if (ws) return;
    if (!ws) {
      console.log(_userId, 'userid');
      const userId = _userId;
      setUserId(userId);
      if (roomId) setRoomId(roomId);
      const connectWebSocket = async () => {
        //파람으로 (공유 url)로 roomId get
        if (searchParams!.get('roomId')) setRoomId(searchParams!.get('roomId') as string);

        const response = await fetch(
          `/api/socket/io?roomId=${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}&userId=${userId}&side=${searchParams!.get('side') ? searchParams!.get('side') : myTeamSide}&host=${searchParams!.get('side') ? false : true}`,
        ); // WebSocket 서버 확인 요청
        if (!response.ok) throw new Error('WebSocket server not ready');
        const _ws = new WebSocket(
          `ws://${process.env.NEXT_PUBLIC_SITE_URL}:3001?roomId=${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}&userId=${userId}&side=${searchParams!.get('side') ? searchParams!.get('side') : myTeamSide}&host=${searchParams!.get('side') ? false : true}`,
        );
        setWs(_ws); // WebSocket 서버 주소로 변경

        _ws.onopen = () => {
          console.log(
            '✅ WebSocket connected' +
              `userId${userId}roomId` +
              `${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}`,
          );
          if (isHost) {
            console.log(rules, 'rules');
            _ws?.send(
              JSON.stringify({
                type: 'init',
                userId: userId,
                roomId: `${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}`,
                rules,
                host: true,
              }),
            );
          } else {
            console.log(rules, 'rules');
            _ws?.send(
              JSON.stringify({
                type: 'init',
                userId: userId,
                roomId: `${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}`,
                host: false,
              }),
            );
          }
        };
        _ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          // 메시지 타입에 따라 알림을 띄움
          // 페이지 별로 이벤트 추가 필요

          if (data.type === 'init') {
            console.log(`📩 새 메시지: ${JSON.stringify(data)}`);
            setRules(data.rules)
          }
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
    return () => {
      if (ws) {
        console.log(ws);
        ws!.onclose();
      }
    };
  }, [ws]);
}

export default useBanpickSocket;
