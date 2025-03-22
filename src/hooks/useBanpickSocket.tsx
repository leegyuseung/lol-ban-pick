import React, { useEffect, useRef, useState } from 'react';

import { usePopupStore, useRulesStore, useSocketStore, useUserStore } from '@/store';
import { usePathname, useSearchParams } from 'next/navigation';
import { FormsData } from '@/types/types';
import { useRouter } from 'next/navigation';
function useBanpickSocket({ userId: _userId, roomId, isHost }: { userId: string; roomId: string; isHost: boolean }) {
  const { setIsOpen, setBtnList, setContent } = usePopupStore();
  const searchParams = useSearchParams();
  //room id
  const { setRoomId } = useSocketStore();
  //user id
  const { setUserId } = useUserStore();
  const { ws, setWs } = useSocketStore();
  const router = useRouter();
  const pathName = usePathname();

  const { setRules, setHostRules, setGuestRules, hostInfo, banpickMode, peopleMode, timeUnlimited, nowSet, position } =
    useRulesStore();
  const socketRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    if (!roomId && !searchParams?.get('roomId')) {
      console.log(`📩 새 메시지: noRoom`);
      setIsOpen(true);
      setContent('공유된 게임이 없습니다.');
      setBtnList([
        {
          text: '돌아가기',
          func: () => {
            setIsOpen(false);
            router.push('/');
          },
        },
      ]);
    }
  }, [pathName]);
  useEffect(() => {
    // WebSocket이 연결되지 않으면 새로 연결 시도
    if (ws) return;
    if (!ws) {
      console.log(_userId, 'userid');
      const userId = _userId;
      setUserId(userId);
      //host 는 postion 을 던져주지 않음
      const positionValue = (searchParams!.get('position') as 'blue' | 'red' | 'audience') ?? position;
      setRules({
        banpickMode,
        peopleMode,
        timeUnlimited,
        nowSet,
        position: positionValue,
        //role 설정
        role: isHost
          ? 'host'
          : (searchParams!.get('position') as 'blue' | 'red' | 'audience') === 'audience'
            ? 'audience'
            : 'guest',
      });
      if (roomId) setRoomId(roomId);
      const connectWebSocket = async () => {
        //파람으로 (공유 url)로 roomId get
        if (searchParams!.get('roomId')) setRoomId(searchParams!.get('roomId') as string);

        const response = await fetch(
          `/api/socket/io?roomId=${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}&userId=${userId}&position=${searchParams!.get('position') ? searchParams!.get('position') : position}&host=${searchParams!.get('position') ? false : true}`,
        ); // WebSocket 서버 확인 요청
        if (!response.ok) throw new Error('WebSocket server not ready');
        const _ws = new WebSocket(
          `ws://${process.env.NEXT_PUBLIC_SITE_URL}:3001?roomId=${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}&userId=${userId}&position=${searchParams!.get('position') ? searchParams!.get('position') : position}&host=${searchParams!.get('position') ? false : true}`,
        );
        setWs(_ws); // WebSocket 서버 주소로 변경

        _ws.onopen = () => {
          console.log(
            '✅ WebSocket connected' +
              `userId${userId}roomId` +
              `${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}`,
          );
          if (isHost) {
            //host일때 (sharePop.tsx에서 메인 페이지에서 가장 먼저 세팅됨)
            console.log(hostInfo, 'hostInfo');
            _ws?.send(
              JSON.stringify({
                type: 'init',
                userId: userId,
                roomId: `${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}`,
                banpickMode,
                peopleMode,
                timeUnlimited,
                nowSet,
                hostInfo,
                host: true,
                role: 'host',
                position: `${searchParams!.get('position') ? searchParams!.get('position') : position}`,
              }),
            );
          } else {
            //이후에 접속된 guest나 관중
            _ws?.send(
              JSON.stringify({
                type: 'init',
                userId: userId,
                roomId: `${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}`,
                host: false,
                position: `${searchParams!.get('position') ? searchParams!.get('position') : position}`,
                role: isHost
                  ? 'host'
                  : (searchParams!.get('position') as 'blue' | 'red' | 'audience') === 'audience'
                    ? 'audience'
                    : 'guest',
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
            setRules(data);
            setHostRules(data.hostInfo);
            setGuestRules(data.guestInfo);
          }
          if (data.type === 'ready') {
            console.log(`📩 새 메시지: ${JSON.stringify(data)}`);
          }
          if (data.type === 'on') {
            console.log(`📩 새 메시지: ${JSON.stringify(data)}`);
          }
          if (data.type === 'closeByHost') {
            console.log(`📩 새 메시지: 종료`);
            setIsOpen(true);
            setContent('게임 주최자가 게임을 종료했습니다.');
            setBtnList([
              {
                text: '돌아가기',
                func: () => {
                  setIsOpen(false);
                  router.push('/');
                },
              },
            ]);
          }
          if (data.type === 'noRoom') {
            console.log(`📩 새 메시지: noRoom`);
            setIsOpen(true);
            setContent('공유된 게임이 없습니다.');
            setBtnList([
              {
                text: '돌아가기',
                func: () => {
                  setIsOpen(false);
                  router.push('/');
                },
              },
            ]);
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
