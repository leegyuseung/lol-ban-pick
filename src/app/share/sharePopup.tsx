//공유하는 컴포넌트

'use client';
import React, { SyntheticEvent, useEffect } from 'react';

import { useSocketStore, useRulesStore, usePopupStore } from '@/store';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useBanpickSocket from '@/hooks/useBanpickSocket';
import ShareUrl from '@/components/Share/ShareUrl';
interface PropType {
  closePopup: () => void;
  userId: string;
  isOpen: boolean;
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
function SharePopup({ closePopup, userId, isOpen }: PropType) {
  //랜덤
  const randomId = Math.random().toString(36).substr(2, 20);
  useBanpickSocket({ userId, roomId: randomId, isHost: true });
  const router = useRouter();
  const { ws, closeWs } = useSocketStore();
  const { roomId, setRoomId } = useSocketStore();
  const { hostInfo, position } = useRulesStore();
  const { setBtnList, setIsOpen, setTitle, setContent } = usePopupStore();
  const pathName = usePathname();
  //room id 설정
  useEffect(() => {
    
    setIsOpen(isOpen);
    if (isOpen) {
      setTitle(`공유하기 roomId${position === 'red' ? '블루팀 공유' : '레드팀 공유'}`);
      setBtnList([
        { text: '대기방 이동', func: goBanpick },
        {
          text: '닫기',
          func: () => {
            setIsOpen(false);
            closePopup();
          },
        },
      ]);
      setContent(<ShareItem roomId={randomId} position={position} myTeamSide={hostInfo.myTeamSide} />);
      setRoomId(randomId);
    }
  }, [isOpen]);

  useEffect(() => {}, [pathName]);
  const goBanpick = () => {
    router.push('/socketTest');
  };
  return <></>;
}

export default SharePopup;
