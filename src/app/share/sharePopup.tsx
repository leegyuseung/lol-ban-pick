//공유하는 컴포넌트

'use client';
import React, { SyntheticEvent, useEffect, useRef } from 'react';

import { useSocketStore, useRulesStore, usePopupStore, useUserStore } from '@/store';
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
  const { ws } = useSocketStore();
  const { roomId, setRoomId } = useSocketStore();
  const { hostInfo, position, banpickMode, peopleMode, timeUnlimited, nowSet, role } = useRulesStore();
  const { setBtnList, setIsOpen, setTitle, setContent, setPopup, isOpen } = usePopupStore();
  const { userId: userIdStore } = useUserStore();
  const pathName = usePathname();
  const { setSocket } = useBanpickSocket({
    userId: localStorage.getItem('lol_ban_host_id') as string,
    roomId: randomId.current,
  });
  const unsubscribeIsOpenRef = useRef<(() => void) | null>(null);
  const unsubscribeWsRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    unsubscribeWsRef.current = useSocketStore.subscribe((state) => {
      console.log('WebSocket 상태 변경됨:', state.ws);
      userId = userIdStore;
      //host시에는 고유한 userId를 계속 사용해야하기때문에 localstorage에 저장
      //guest는 새창이 나올때마다 새로운 id부여
      if (localStorage.getItem('lol_ban_host_id') && role === 'host') {
        userId = localStorage.getItem('lol_ban_host_id') as string;
      }
      const { isOpen } = usePopupStore.getState(); // 최신 상태 가져오기
    });

    unsubscribeIsOpenRef.current = usePopupStore.subscribe((state) => {
      console.log('Popup 상태 변경됨:', state.isOpen);
      const { ws, roomId } = useSocketStore.getState(); // 최신 상태 가져오기
      if (ws && ws.readyState === WebSocket.OPEN) {
        if (!state.isOpen) {
          if (pathName != '/') {
            return;
          }
          ws.send(JSON.stringify({ type: 'closeSharePopup', roomId, userId }));
          // randomId.current = Math.random().toString(36).substr(2, 20);
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
      //가장 처음 소켓 세팅
      if (!ws) setSocket();
      //팝업 닫고 다시 실행 시나 ws가 세팅 되어있을때
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
    } else {
      setIsOpen(false);
      setSharePopup(false);
    }
  }, [isShareOpen]); // 의존성 배열에 isShareOpen만 남겨두고 상태 업데이트 순서를 조정

  useEffect(() => {}, [pathName]);
  const goBanpick = () => {
    //페이지를 이동할때는 소켓 세팅 필요 x
    if (unsubscribeIsOpenRef.current) {
      unsubscribeIsOpenRef.current();
    }
    router.push('/socketTest');
  };
  return <></>;
});
SharePopup.displayName = 'SharePopup';
export default SharePopup;
