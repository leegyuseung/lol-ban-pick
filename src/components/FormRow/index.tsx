'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Button from '../Button';
import useImageLoaded from '@/hooks/useImageLoaded';
import TeamLogoPopup from '../TeamLogoPopup';
import { useForm } from 'react-hook-form';
import { useRulesStore, usePeerlessStore } from '@/store';
import { FormsData } from '@/types/types';
import { useRouter } from 'next/navigation';
import SharePopup from '@/app/share/sharePopup';
import SharePopupWrapper from '@/app/share/sharePopupWrapper';

export default function Form() {
  useImageLoaded();
  const { setRules, setHostRules, setClearPeerlessSet } = useRulesStore();
  const { setClearMyBan, setClearYourBan } = usePeerlessStore();
  const { register, handleSubmit, watch } = useForm<FormsData>({
    defaultValues: {
      blueTeamName: '',
      redTeamName: '',
      banpickMode: 'tournament',
      peopleMode: 'solo',
      timeUnlimited: 'true',
      myTeamSide: 'blue',
      yourTeamSide: 'red',
      blueImg: '',
      redImg: '',
      nowSet: 1,
    },
  });

  useEffect(() => {
    setClearPeerlessSet();
    setClearMyBan();
    setClearYourBan();
  }, []);

  const blueTeam = watch('blueTeamName') || '블루팀';
  const redTeam = watch('redTeamName') || '레드팀';
  const router = useRouter();
  const selectedMode = watch('peopleMode');
  const [blueImage, setBlueImage] = useState('/images/t1.webp');
  const [redImage, setRedImage] = useState('/images/hanwha.webp');

  // 팝업관련
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeamColor, setSelectedTeamColor] = useState('');

  //소켓 팝업 관련
  const [isShareOpen, setIsShareOpen] = useState(false);
  const onSubmit = async (data: FormsData) => {
    // 이미지 넣어주기
    data.blueImg = blueImage;
    data.redImg = redImage;
    setRules(data);
    setHostRules(data);
    if (data.peopleMode === 'team') {
      openSharePopup();
    } else {
      router.push('/banpick');
    }
  };

  const openSharePopup = () => {
    setIsShareOpen(true);
  };

  const closeSharePopup = () => {
    setIsShareOpen(false);
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
    router.prefetch('/banpick');
  }, [router]);

  return (
    <div className="flex flex-col items-center p-7">
      <span className="text-4xl font-bold pb-6">밴픽 시뮬레이터</span>
      <form className="grid grid-cols-[1fr_2fr_1fr] h-full justify-between gap-20" onSubmit={handleSubmit(onSubmit)}>
        {/* 블루팀 */}
        <div className="flex flex-col justify-center items-center gap-6 w-[230px]">
          <div className="relative w-[200px] h-[200px] cursor-pointer" onClick={() => openPopup('blue')}>
            <Image className="object-contain" sizes="w-[200px] h-[200px]" src={blueImage} alt="logo" fill priority />
          </div>
          <label className="text-lg font-semibold mb-2">{blueTeam}</label>
          <input
            className="p-3 bg-blue-700 rounded-md border-mainText placeholder-mainText w-full"
            {...register('blueTeamName')}
            placeholder="블루팀 이름을 입력해주세요."
          />
        </div>

        <div className="flex flex-col gap-10 w-[400px]">
          <div>
            {/* 밴픽 모드 */}
            <label className="text-lg font-semibold mb-2 block">밴픽 모드</label>
            <div className="flex w-full justify-center gap-x-5">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" value="tournament" {...register('banpickMode')} defaultChecked />
                토너먼트 드리프트
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" value="peerless3" {...register('banpickMode')} />
                피어리스(3판)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" value="peerless5" {...register('banpickMode')} />
                피어리스(5판)
              </label>
            </div>
          </div>

          {/* 참여 모드 */}
          <div>
            <label className="text-lg font-semibold mb-2 block">참여 모드</label>
            <div className="flex w-full justify-center gap-x-32">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" value="solo" {...register('peopleMode')} defaultChecked />
                SOLO
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" value="team" {...register('peopleMode')} />
                TEAM
              </label>
            </div>
          </div>

          {/* 시간제한 */}
          {selectedMode === 'solo' && (
            <div>
              <label className="text-lg font-semibold mb-2 block">시간 무제한</label>
              <div className="flex w-full justify-center gap-x-32">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" value="true" {...register('timeUnlimited')} defaultChecked />
                  시간 무제한
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" value="false" {...register('timeUnlimited')} />
                  제한 있음
                </label>
              </div>
            </div>
          )}

          {/* 진영선택 */}
          {selectedMode !== 'solo' && (
            <div>
              <label className="text-lg font-semibold mb-2 block">진영</label>
              <div className="flex w-full justify-center gap-x-32">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" value="blue" {...register('myTeamSide')} defaultChecked />
                  블루팀
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" value="red" {...register('myTeamSide')} />
                  레드팀
                </label>
              </div>
            </div>
          )}
          <Button
            type={'submit'}
            className={
              'w-full border border-mainText text-mainText p-3 rounded-md font-semibold hover:bg-gray-500 transition'
            }
            text={'시작하기'}
          />
        </div>

        {/* 레드팀 */}
        <div className="flex flex-col justify-center items-center gap-6 w-[230px]">
          <div className="relative w-[200px] h-[200px] cursor-pointer" onClick={() => openPopup('red')}>
            <Image className="object-contain" sizes="w-[200px] h-[200px]" src={redImage} alt="logo" fill priority />
          </div>
          <label className="text-lg font-semibold mb-2">{redTeam}</label>
          <input
            className="p-3 bg-red-700 rounded-md border-mainText placeholder-mainText w-full"
            {...register('redTeamName')}
            placeholder="레드팀 이름을 입력해주세요."
          />
        </div>
      </form>

      {/* 공유하기 팝업 */}
      {isShareOpen && <SharePopupWrapper closePopup={closeSharePopup} />}
      {/* 이미지 선택 팝업 */}
      {isOpen && (
        <TeamLogoPopup
          closePopup={closePopup}
          setBlueImage={setBlueImage}
          setRedImage={setRedImage}
          blueImage={blueImage}
          redImage={redImage}
          selectedTeamColor={selectedTeamColor}
        />
      )}
    </div>
  );
}
