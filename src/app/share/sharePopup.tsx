//공유하는 컴포넌트

'use client';
import React, { SyntheticEvent, useEffect, useRef } from 'react';

import { useSocketStore, useRulesStore, usePopupStore } from '@/store';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useBanpickSocket from '@/hooks/useBanpickSocket';
import ShareUrl from '@/components/Share/ShareUrl';
interface PropType {
  setSharePopup: (b: boolean) => void;
  userId: string;
  isShareOpen: boolean;
}
function ShareItem({
  roomId,
  myTeamSide,
  position,
}: {
  roomId: string;
  myTeamSide: string;
  position: string | undefined;
}) {
  return (
    <>
      <ShareUrl
        url={`http://${process.env.NEXT_PUBLIC_SITE_URL}:3000/socketTest?roomId=${roomId}&position=${myTeamSide === 'red' ? 'blue' : 'red'}`}
        role={position === 'red' ? '블루팀 공유' : '레드팀'}
      />
      <ShareUrl
        url={`http://${process.env.NEXT_PUBLIC_SITE_URL}:3000/socketTest?roomId=${roomId}&position=audience`}
        role={'관전자'}
      />
    </>
  );
}
const SharePopup = React.memo(({ setSharePopup, userId, isShareOpen }: PropType) => {
  //랜덤
  const randomId = useRef<string>(Math.random().toString(36).substr(2, 20));
  const router = useRouter();
  const { ws, closeWs } = useSocketStore();
  const { roomId, setRoomId } = useSocketStore();
  const { hostInfo, position, banpickMode, peopleMode, timeUnlimited, nowSet } = useRulesStore();
  const { setBtnList, setIsOpen, setTitle, setContent, setPopup, isOpen } = usePopupStore();
  const pathName = usePathname();
  const { setSocket } = useBanpickSocket({ userId, roomId: randomId.current });
  const unsubscribeWsRef = useRef<(() => void) | null>(null);
  const unsubscribeIsOpenRef = useRef<(() => void) | null>(null);
  // // ✅ isOpen 상태가 변경될 때 감지
  // useEffect(() => {
  //   if (!isOpen && ws?.readyState === WebSocket.OPEN) {
  //     ws.send(JSON.stringify({ type: 'closeSharePopup', roomId }));
  //   }
  // }, [isOpen]);

  useEffect(() => {
    unsubscribeWsRef.current = useSocketStore.subscribe((state) => {
      console.log('WebSocket 상태 변경됨:', state.ws);

      const { isOpen } = usePopupStore.getState(); // 최신 상태 가져오기

      if (state.ws && state.ws.readyState === WebSocket.OPEN) {
        debugger;
        if (!isOpen) {
          // state.ws.send(JSON.stringify({ type: 'closeSharePopup', roomId, userId }));
          // state.ws.send(JSON.stringify({ type: 'closeSharePopup', roomId }));
        } else {
          // state.ws.send(
          //   JSON.stringify({
          //     type: 'init',
          //     userId,
          //     roomId: randomId.current,
          //     banpickMode,
          //     peopleMode,
          //     timeUnlimited,
          //     nowSet,
          //     hostInfo,
          //     host: true,
          //     role: 'host',
          //     position,
          //   }),
          // );
          // state.ws.send(
          //   JSON.stringify({
          //     type: 'init',
          //     userId,
          //     roomId,
          //     banpickMode,
          //     peopleMode,
          //     timeUnlimited,
          //     nowSet,
          //     hostInfo,
          //     host: true,
          //     role: 'host',
          //     position,
          //   }),
          // );
        }
      }
    });

    unsubscribeIsOpenRef.current = usePopupStore.subscribe((state) => {
      console.log('Popup 상태 변경됨:', state.isOpen);
      const { ws, roomId } = useSocketStore.getState(); // 최신 상태 가져오기
      if (ws && ws.readyState === WebSocket.OPEN) {
        if (!state.isOpen) {
          if (pathName != '/') {
            return;
          }
          debugger;
          ws.send(JSON.stringify({ type: 'closeSharePopup', roomId, userId }));
          // randomId.current = Math.random().toString(36).substr(2, 20);
        } else {
        }
      }
    });

    return () => {
      if (unsubscribeWsRef.current) unsubscribeWsRef.current();
      if (unsubscribeIsOpenRef.current) unsubscribeIsOpenRef.current();
    };
  }, []);

  //room id 설정
  useEffect(() => {
    if (isShareOpen) {
      setRoomId(randomId.current);
      // 첫 번째로 상태를 설정합니다.
      if (!ws) setSocket();
      if (ws)
        ws.send(
          JSON.stringify({
            type: 'init',
            userId,
            roomId: randomId.current,
            banpickMode,
            peopleMode,
            timeUnlimited,
            nowSet,
            hostInfo,
            host: true,
            role: 'host',
            position,
          }),
        );
      setPopup({
        title: `공유하기 roomId${position === 'red' ? '블루팀 공유' : '레드팀 공유'}`,
        isOpen: true,
        content: <ShareItem roomId={randomId.current} position={position} myTeamSide={hostInfo.myTeamSide} />,
        btnList: [
          { text: '대기방 이동', func: goBanpick },
          {
            text: '닫기',
            func: () => {
              setIsOpen(false);
              setSharePopup(false);
            },
          },
        ],
      });
      // setRoomId(randomId.current);
    } else {
      // isShareOpen이 false일 때 초기화 등을 처리할 수 있습니다.
      setIsOpen(false);
      setSharePopup(false);
    }
  }, [isShareOpen]); // 의존성 배열에 isShareOpen만 남겨두고 상태 업데이트 순서를 조정
  // useEffect(() => {
  //   console.log(isShareOpen,"isShare")
  //   if (!ws && isShareOpen) setSocket();
  //   if (!isShareOpen) {
  //     debugger;
  //     if (ws?.readyState === ws?.OPEN) {
  //       ws?.send(JSON.stringify({ type: 'closeSharePopup', roomId }));
  //     }
  //   }
  // }, [isOpen]);
  useEffect(() => {}, [pathName]);
  const goBanpick = () => {
    if (unsubscribeIsOpenRef.current) {
      unsubscribeIsOpenRef.current();
    }
    router.push('/socketTest');
  };
  return <>{roomId + 'roomId'}</>;
});
SharePopup.displayName = 'SharePopup';
export default SharePopup;
