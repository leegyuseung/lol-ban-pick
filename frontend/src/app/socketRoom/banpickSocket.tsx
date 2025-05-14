//소켓 연결 페이지
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import useBanpickSocket from '@/hooks/useBanpickSocket';
import Image from 'next/image';
import ConfirmPopup from '@/components/Popup/confirm';
import { useRulesStore, useSocketStore } from '@/store';
import { useSearchParams } from 'next/navigation';
import { FaCheck, FaCopy } from 'react-icons/fa6';
import { infoStatusOptions, roleOptions, socketType, teamSideOptions } from '@/constants';
import { KakaoAdM, KakaoAdWaiting } from '@/components/KaKaoAd';

function BanpickSocket({ userId: _userId }: { userId: string }) {
  const [copyedText, setCopyedText] = useState('');
  const [showConfirmPopup, setIsShowConfirmPopup] = useState(false);
  const copyText = (url: string) => {
    navigator.clipboard.writeText(url);
    handleShowPopup(true);
    setCopyedText(url);
  };

  const handleShowPopup = (isShow: boolean) => {
    setIsShowConfirmPopup(isShow); // 직접 새로운 값 설정
  };
  const searchParams = useSearchParams();
  //room id
  const { roomId, shareUrl } = useSocketStore();
  //user id
  const { socket } = useSocketStore();
  const { audienceCount, role, hostInfo, guestInfo, position } = useRulesStore();
  const { setSocketFunc } = useBanpickSocket({ userId: _userId, roomId });
  const onReady = () => {
    socket?.emit(socketType.READY, { role, roomId });
  };
  const onCancel = () => {
    socket?.emit(socketType.READYCANCEL, { role, roomId });
  };
  useEffect(() => {
    if (!searchParams?.get('roomId') && !roomId && role === roleOptions.HOST) {
      socket?.emit(socketType.NOROOM);
    }
    setSocketFunc();
  }, [role]);
  const goEnter = () => {
    socket?.emit(socketType.BANPICKSTART, { roomId });
  };
  const redCount = useMemo(() => {
    const teamSide = hostInfo.myTeamSide === teamSideOptions.RED ? hostInfo : guestInfo;
    return !teamSide || !teamSide.status || ![infoStatusOptions.JOIN, infoStatusOptions.READY].includes(teamSide.status)
      ? 0
      : 1;
  }, [guestInfo, hostInfo]);
  const blueCount = useMemo(() => {
    const teamSide = hostInfo.myTeamSide === teamSideOptions.BLUE ? hostInfo : guestInfo;

    return !teamSide || !teamSide.status || ![infoStatusOptions.JOIN, infoStatusOptions.READY].includes(teamSide.status)
      ? 0
      : 1;
  }, [guestInfo, hostInfo]);
  const redTeamName = useMemo(() => {
    const teamSide = hostInfo.myTeamSide === teamSideOptions.RED ? hostInfo : guestInfo;
    return teamSide.myTeam;
  }, [guestInfo, hostInfo]);
  const blueTeamName = useMemo(() => {
    const teamSide = hostInfo.myTeamSide === teamSideOptions.BLUE ? hostInfo : guestInfo;

    return teamSide.myTeam;
  }, [guestInfo, hostInfo]);

  const blueTeamImg = useMemo(() => {
    const teamSide = hostInfo.myTeamSide === teamSideOptions.BLUE ? hostInfo : guestInfo;

    return teamSide.myImg ? teamSide.myImg : '/images/t1.webp';
  }, [guestInfo, hostInfo]);
  const redTeamImg = useMemo(() => {
    const teamSide = hostInfo.myTeamSide === teamSideOptions.RED ? hostInfo : guestInfo;

    return teamSide.myImg ? teamSide.myImg : '/images/hanwha.webp';
  }, [guestInfo, hostInfo]);
  const isHostReady = useMemo(() => hostInfo.status === infoStatusOptions.READY, [hostInfo]);
  const isGuestReady = useMemo(() => guestInfo.status === infoStatusOptions.READY, [guestInfo]);
  return (
    <>
      <div className="min-h-screen bg-mainBlack text-white flex flex-col items-center p-6">
        <h1 className="md:text-3xl font-bold text-center mb-8 text-mainText">밴픽 대기방</h1>

        <div className="grid grid-cols-3 gap-1 md:gap-6 w-full max-w-4xl">
          {/* 블루팀 */}
          <div
            className={`${isHostReady ? 'bg-blue-700' : 'bg-blue-500'} p-2 md:p-6 pt-3 rounded-lg shadow-lg border-2 border-blue-500`}
          >
            <div
              className={`${isHostReady ? 'bg-blue-400' : 'bg-gray-500'} text-white md:w-[30%] text-xs rounded-[5px] text-center`}
            >
              {isHostReady ? '준비 완료' : '준비 중'}
            </div>
            <div className="relative w-full h-[200px]">
              <Image
                className="object-contain"
                sizes="w-[200px] h-[200px]"
                src={blueTeamImg}
                alt="logo"
                fill
                priority
              />
            </div>
            <h2 className="text-xs md:text-xl font-medium">
              {role === roleOptions.HOST ? (
                position === teamSideOptions.RED ? (
                  <i className="w-[20px] h-[20px]" onClick={() => copyText(shareUrl.yourTeamUrl)}>
                    {shareUrl.yourTeamUrl === copyedText ? <FaCheck /> : <FaCopy />}
                  </i>
                ) : (
                  <i className="w-[20px] h-[20px]"></i>
                )
              ) : (
                <></>
              )}
              {blueTeamName} ({blueCount}/1)
            </h2>
          </div>
          {/* 관전자 */}
          <div className="flex flex-col justify-between bg-gray-800 p-2 md:p-6 rounded-lg shadow-lg border-2 border-gray-600">
            <div>
              <h2 className="text-ms md:text-xl font-medium">관전자</h2>
              <h2 className="text-xs md:text-xl font-medium">(무제한)</h2>
            </div>
            <div>
              <p className="mt-2 text-xs md:text-sm mb-1 text-gray-300">현재 접속자: {audienceCount}명</p>
              {role === roleOptions.HOST ? (
                <i className="w-2 h-2 md:w-5 md:h-5" onClick={() => copyText(shareUrl.audienceTeamUrl)}>
                  {shareUrl.audienceTeamUrl === copyedText ? <FaCheck /> : <FaCopy />}
                </i>
              ) : (
                <></>
              )}
            </div>
          </div>

          {/* 레드팀 */}
          <div
            className={`${isGuestReady ? 'bg-red-700' : 'bg-red-500'} p-2 md:p-6 pt-3 rounded-lg shadow-lg border-2 border-red-500`}
          >
            <div
              className={`${isGuestReady ? 'bg-red-500' : 'bg-gray-500'} text-white md:w-[30%] text-[12px] rounded-[5px] text-center`}
            >
              {isGuestReady ? '준비 완료' : '준비 중'}
            </div>
            <div className="relative w-full h-[200px]">
              <Image className="object-contain" sizes="w-[200px] h-[200px]" src={redTeamImg} alt="logo" fill priority />
            </div>
            <h2 className="text-xs md:text-xl font-medium">
              {redTeamName} ({redCount}/1)
            </h2>
            {role === roleOptions.HOST ? (
              position === teamSideOptions.BLUE ? (
                <i className="w-2 h-2 md:w-5 md:h-5" onClick={() => copyText(shareUrl.yourTeamUrl)}>
                  {shareUrl.yourTeamUrl === copyedText ? <FaCheck /> : <FaCopy />}
                </i>
              ) : (
                <i className="w-2 h-2 md:w-5 md:h-5"></i>
              )
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-mainText">게임이 곧 시작됩니다.</p>
          <div className="flex w-[300px] justify-evenly mt-5">
            {role === roleOptions.HOST || role === roleOptions.GUEST ? (
              (role === roleOptions.HOST && isHostReady) || (role === roleOptions.GUEST && isGuestReady) ? (
                <button
                  className="cursor-pointer h-8 px-8 text-mainText bg-orange-700 font-medium text-xs rounded-sm md:hover:bg-opacity-65"
                  onClick={onCancel}
                >
                  취소하기
                </button>
              ) : (
                <button
                  className="cursor-pointer h-8 px-8 text-mainText bg-mainGold font-medium text-xs rounded-sm md:hover:bg-opacity-65"
                  onClick={onReady}
                >
                  준비하기
                </button>
              )
            ) : (
              <></>
            )}
            {role === roleOptions.HOST ? (
              <button
                className={`${!isHostReady || !isGuestReady ? 'cursor-not-allowed' : 'cursor-pointer'} h-8 px-8 text-mainText bg-mainGold font-medium text-xs rounded-sm md:hover:bg-opacity-65`}
                onClick={goEnter}
                disabled={!isHostReady || !isGuestReady}
              >
                시작하기
              </button>
            ) : null}
          </div>
        </div>
        <KakaoAdWaiting />
        <KakaoAdM />
      </div>
      <ConfirmPopup
        isOpen={showConfirmPopup}
        setIsOpen={setIsShowConfirmPopup}
        content={'클립보드에 복사되었습니다.'}
      />
    </>
  );
}

export default BanpickSocket;
