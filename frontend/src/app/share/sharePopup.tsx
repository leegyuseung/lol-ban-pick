//공유하는 컴포넌트

'use client';
import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';

import { useSocketStore, useRulesStore, usePopupStore, useUserStore } from '@/store';
import { usePathname, useRouter } from 'next/navigation';
import useBanpickSocket from '@/hooks/useBanpickSocket';
import ShareUrl from '@/components/Share/ShareUrl';
import ConfirmPopup from '@/components/Popup/confirm';
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
  const [_shareUrl, _setShareUrl] = useState({
    yourTeamUrl: `${process.env.NEXT_PUBLIC_URL}/socketRoom?roomId=${roomId}&position=${myTeamSide === 'red' ? 'blue' : 'red'}`,
    audienceTeamUrl: `${process.env.NEXT_PUBLIC_URL}/socketRoom?roomId=${roomId}&position=audience`,
  });
  const [copyedText, setCopyedText] = useState('');
  const [showConfirmPopup, setIsShowConfirmPopup] = useState(false);
  const copyText = (e: SyntheticEvent, url: string) => {
    navigator.clipboard.writeText(url);
    handleShowPopup(true);
    setCopyedText(url);
  };

  const handleShowPopup = (isShow: boolean) => {
    setIsShowConfirmPopup(isShow); // 직접 새로운 값 설정
  };
  return (
    <>
      <ShareUrl
        url={`${process.env.NEXT_PUBLIC_URL}/socketRoom?roomId=${roomId}&position=${myTeamSide === 'red' ? 'blue' : 'red'}`}
        role={position === 'red' ? '블루팀 공유' : '레드팀'}
        copyText={copyText}
        isCopyed={_shareUrl.yourTeamUrl === copyedText}
      />
      <ShareUrl
        url={`${process.env.NEXT_PUBLIC_URL}/socketRoom?roomId=${roomId}&position=audience`}
        role={'관전자'}
        copyText={copyText}
        isCopyed={_shareUrl.audienceTeamUrl === copyedText}
      />

      <ConfirmPopup
        isOpen={showConfirmPopup}
        setIsOpen={setIsShowConfirmPopup}
        content={'클립보드에 복사되었습니다.'}
      />
    </>
  );
}
const SharePopup = React.memo(({ setSharePopup, userId, isShareOpen }: PropType) => {
  //랜덤
  const randomId = useRef<string>(Math.random().toString(36).substr(2, 20));
  const router = useRouter();
  const { socket, setShareUrl, shareUrl } = useSocketStore();
  const { roomId, setRoomId } = useSocketStore();
  const { hostInfo, position, banpickMode, peopleMode, timeUnlimited, nowSet, role } = useRulesStore();
  const { setBtnList, setIsOpen, setTitle, setContent, setPopup, isOpen } = usePopupStore();
  const { userId: userIdStore } = useUserStore();
  const pathName = usePathname();
  const { setSocketFunc } = useBanpickSocket({
    userId: localStorage.getItem('lol_ban_host_id') as string,
    roomId: randomId.current,
  });
  const unsubscribeIsOpenRef = useRef<(() => void) | null>(null);
  const unsubscribeWsRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    unsubscribeWsRef.current = useSocketStore.subscribe((state) => {
      console.log('WebSocket 상태 변경됨::', state.socket);
      userId = userIdStore;
      //host시에는 고유한 userId를 계속 사용해야하기때문에 localstorage에 저장
      //guest는 새창이 나올때마다 새로운 id부여
      if (role === 'host') {
        if (!localStorage.getItem('lol_ban_host_id')) {
          localStorage.setItem('lol_ban_host_id', `${Math.floor(Math.random() * 100000000)}`);
        }
        userId = localStorage.getItem('lol_ban_host_id') as string;
      }
      const { isOpen } = usePopupStore.getState(); // 최신 상태 가져오기
    });

    unsubscribeIsOpenRef.current = usePopupStore.subscribe((state) => {
      console.log('Popup 상태 변경됨:', state.isOpen);
      const { socket, roomId } = useSocketStore.getState(); // 최신 상태 가져오기
      if (socket && socket.connected) {
        if (!state.isOpen) {
          if (pathName != '/') {
            return;
          }
          socket.emit('closeSharePopup', {
            roomId,
            userId: localStorage.getItem('lol_ban_host_id') as string,
          });
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
      if (!socket) setSocketFunc();
      //팝업 닫고 다시 실행 시나 socket가 세팅 되어있을때
      if (socket)
        socket.send(
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
      setShareUrl({
        yourTeamUrl: `${process.env.NEXT_PUBLIC_URL}/socketRoom?roomId=${randomId.current}&position=${hostInfo.myTeamSide === 'red' ? 'blue' : 'red'}`,
        audienceTeamUrl: `${process.env.NEXT_PUBLIC_URL}/socketRoom?roomId=${randomId.current}&position=audience`,
      });
      setPopup({
        title: `공유하기`,
        isOpen: true,
        content: isShareOpen ? (
          <ShareItem roomId={randomId.current} position={position} myTeamSide={hostInfo.myTeamSide} />
        ) : (
          <></>
        ),
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
    router.push('/socketRoom');
  };
  return <></>;
});
SharePopup.displayName = 'SharePopup';
export default SharePopup;
