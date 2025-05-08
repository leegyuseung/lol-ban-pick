'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Button from '@/components/Button';
import TeamLogoPopup from '@/components/TeamLogoPopup';
import SharePopupWrapper from '@/app/share/sharePopupWrapper';
import { useForm } from 'react-hook-form';
import { useRulesStore, usePeerlessStore, useSocketStore, useBanStore } from '@/store';
import { useRouter } from 'next/navigation';
import { FormsType } from '@/types';
import { banPickModeOptions, navigations, peopleModeOptions, socketType, teamSideOptions } from '@/constants';

export default function Form() {
  const { socket, setRoomId, setSocket } = useSocketStore();
  const { setChampionInfo, setClearBanPickObject, setClearSelectTeamIndex, setClearCurrentLocation } = useBanStore();
  const { setFormRules, setHostRules, setClearPeerlessSet } = useRulesStore();
  const { setClearHostBan, setClearGuestBan, setRedBanClear, setBlueBanClear } = usePeerlessStore();
  const { register, handleSubmit, watch } = useForm<FormsType>({
    defaultValues: {
      blueTeamName: '',
      redTeamName: '',
      banpickMode: banPickModeOptions.TNM,
      peopleMode: peopleModeOptions.SOLO,
      timeUnlimited: 'true',
      myTeamSide: teamSideOptions.BLUE,
      yourTeamSide: teamSideOptions.RED,
      blueImg: '',
      redImg: '',
      nowSet: 1,
    },
  });

  // 전부 초기화
  useEffect(() => {
    setChampionInfo(); // 챔피언 정보 초기화
    setClearBanPickObject(); // 밴픽 객체 초기화
    setClearSelectTeamIndex(); // 선택된 팀 인덱스 초기화
    setClearCurrentLocation(); // 현재 위치 초기화
    setClearPeerlessSet();
    setClearHostBan();
    setClearGuestBan();
    setRedBanClear();
    setBlueBanClear();
    if (socket) {
      socket.emit(socketType.CLOSEBYHOST, {
        userId: localStorage.getItem('lol_ban_host_id') as string,
      });
      setSocket(null);
      setRoomId('');
    }
  }, []);

  const blueTeam = watch('blueTeamName') || '블루팀';
  const redTeam = watch('redTeamName') || '레드팀';
  const router = useRouter();
  const selectedMode = watch('peopleMode');
  const [blueImage, setBlueImage] = useState('/images/t1.webp');
  const [redImage, setRedImage] = useState('/images/geng.webp');

  // 팝업관련
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeamColor, setSelectedTeamColor] = useState('');

  //소켓 팝업 관련
  const [isShareOpen, setIsShareOpen] = useState(false);
  const onSubmit = async (data: FormsType) => {
    // 이미지 넣어주기
    data.blueImg = blueImage;
    data.redImg = redImage;
    setFormRules(data);
    setHostRules({ ...data, status: '' });
    if (data.peopleMode === peopleModeOptions.TEAM) {
      openSharePopup();
    } else {
      router.push(navigations.BANPICK);
    }
  };

  const openSharePopup = () => {
    setIsShareOpen(true);
  };

  const setSharePopup = (b: boolean) => {
    setIsShareOpen(b);
  };
  const openPopup = (teamColor: string) => {
    setSelectedTeamColor(teamColor);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  // 경로의 페이지를 미리 로드
  useEffect(() => {
    router.prefetch(navigations.BANPICK);
    router.prefetch(navigations.BANPICKTEAM);
  }, [router]);

  return (
    <div className="flex flex-col items-center min-h-full pt-20 md:p-7 md:mt-20">
      <h1 className="md:text-4xl font-medium pb-6">밴픽 시뮬레이터</h1>
      <form
        className="md:grid md:grid-cols-[1fr_2fr_1fr] md:justify-between md:gap-20 h-full flex flex-col items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* 블루팀 */}
        <div className="hidden md:flex flex-col justify-center items-center gap-6 w-[230px]">
          <div className="relative w-[200px] h-[200px] cursor-pointer" onClick={() => openPopup(teamSideOptions.BLUE)}>
            <Image className="object-contain" sizes="w-[200px] h-[200px]" src={blueImage} alt="logo" fill priority />
          </div>
          <h3 className="text-lg font-medium mb-2">{blueTeam}</h3>
          <input
            className="text-center p-3 bg-blue-700 rounded-md border-mainText placeholder-mainText w-full"
            {...register('blueTeamName')}
            placeholder="블루팀 이름을 입력해주세요."
          />
        </div>

        <div className="flex flex-col gap-10 min-w-[375px] md:w-[500px] ">
          <div>
            {/* 밴픽 모드 */}
            <h3 className="flex justify-center text-sm md:text-lg font-medium mb-2 md:block">밴픽 모드</h3>
            <div className="flex w-full justify-center gap-x-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm">
                <input type="radio" value="tournament" {...register('banpickMode')} defaultChecked />
                토너먼트 드리프트
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm">
                <input type="radio" value="peerless3" {...register('banpickMode')} />
                피어리스(3판)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm">
                <input type="radio" value="peerless5" {...register('banpickMode')} />
                피어리스(5판)
              </label>
            </div>
          </div>

          {/* 참여 모드 */}
          <div>
            <h3 className="flex justify-center text-sm md:text-lg font-medium mb-2 md:block">참여 모드</h3>
            <div className="flex w-full justify-center gap-x-32">
              <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm">
                <input type="radio" value="solo" {...register('peopleMode')} defaultChecked />
                SOLO
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm">
                <input type="radio" value="team" {...register('peopleMode')} />
                TEAM
              </label>
            </div>
          </div>

          {/* 시간제한 */}
          {selectedMode === 'solo' && (
            <div>
              <h3 className="flex justify-center text-sm md:text-lg font-medium mb-2 md:block">시간 무제한</h3>
              <div className="flex w-full justify-center gap-x-32">
                <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm">
                  <input type="radio" value="true" {...register('timeUnlimited')} defaultChecked />
                  시간 무제한
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm">
                  <input type="radio" value="false" {...register('timeUnlimited')} />
                  제한 있음
                </label>
              </div>
            </div>
          )}

          {/* 진영선택 */}
          {selectedMode !== 'solo' && (
            <div>
              <h3 className="flex justify-center text-sm md:text-lg font-medium mb-2 md:block">진영</h3>
              <div className="flex w-full justify-center gap-x-32">
                <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm">
                  <input type="radio" value="blue" {...register('myTeamSide')} defaultChecked />
                  블루팀
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm">
                  <input type="radio" value="red" {...register('myTeamSide')} />
                  레드팀
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-center items-center">
            <Button
              type={'submit'}
              className={
                'text-xs md:text-base w-2/3 md:w-full border border-mainText text-mainText p-3 rounded-md font-medium hover:bg-gray-500 transition'
              }
              text={'시작하기'}
            />
          </div>
        </div>

        {/* 레드팀 */}
        <div className="hidden md:flex flex-col justify-center items-center gap-6 w-[230px]">
          <div className="relative w-[200px] h-[200px] cursor-pointer" onClick={() => openPopup(teamSideOptions.RED)}>
            <Image className="object-contain" sizes="w-[200px] h-[200px]" src={redImage} alt="logo" fill priority />
          </div>
          <h3 className="text-lg font-medium mb-2">{redTeam}</h3>
          <input
            className="text-center p-3 bg-red-700 rounded-md border-mainText placeholder-mainText w-full"
            {...register('redTeamName')}
            placeholder="레드팀 이름을 입력해주세요."
          />
        </div>
      </form>

      {/* 공유하기 팝업 */}
      {<SharePopupWrapper setSharePopup={setSharePopup} isShareOpen={isShareOpen} />}
      {/* 이미지 선택 팝업 */}
      {
        <div className={`${isOpen ? '' : 'hidden'}`}>
          <TeamLogoPopup
            closePopup={closePopup}
            setBlueImage={setBlueImage}
            setRedImage={setRedImage}
            blueImage={blueImage}
            redImage={redImage}
            selectedTeamColor={selectedTeamColor}
          />
        </div>
      }
    </div>
  );
}
