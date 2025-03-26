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
  const { ws } = useSocketStore();
  const { roomId, setRoomId } = useSocketStore();
  const { hostInfo, position, banpickMode, peopleMode, timeUnlimited, nowSet } = useRulesStore();
  const { setBtnList, setIsOpen, setTitle, setContent, setPopup, isOpen } = usePopupStore();
  const pathName = usePathname();
  const { setSocket } = useBanpickSocket({ userId, roomId: randomId.current });
  const unsubscribeIsOpenRef = useRef<(() => void) | null>(null);

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
