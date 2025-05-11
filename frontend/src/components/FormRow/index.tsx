'use client';
import NextImage from 'next/image';
import React, { useEffect, useState } from 'react';
import Button from '@/components/Button';
import TeamLogoPopup from '@/components/TeamLogoPopup';
import SharePopupWrapper from '@/app/share/sharePopupWrapper';
import HoverCards from '@/components/HoverCard';
import { useForm } from 'react-hook-form';
import { useRulesStore, usePeerlessStore, useSocketStore, useBanStore } from '@/store';
import { useRouter } from 'next/navigation';
import { FormsType } from '@/types';
import { banPickModeOptions, navigations, peopleModeOptions, socketType, teamSideOptions } from '@/constants';
import { CircleHelp } from 'lucide-react';

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

  // 전부 초기화
  useEffect(() => {
    console.log(
      `        ███╗   ███╗███████╗████████╗ █████╗ ███████╗██╗ ██████╗██╗  ██╗ %c
         ████╗  ████║██╔════╝╚═ ═██╔ ══╝██╔══██╗██╔══ ██╗██║  ██╔════╝██║ ██╔╝ %c
        ██╔████╔██║█████╗     ██║   ███████║██████╔╝██║ ██║     █████╔╝  %c
        ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██╔═══╝ ██║ ██║     ██╔═██╗  %c
        ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║██║     ██║╚██████╗ ██║  ██╗ %c
        ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝ %c`,
      `color: #500724; font-size: 10px; padding:2px 0; font-family: monospace`,
      `color: #831843;`,
      `color: #9d174d;`,
      `color: #be123c;`,
      `color: #e11d48;`,
      `color: #f43f5e;`,
    );

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

  useEffect(() => {
    router.prefetch('/banpick');
  }, [router]);

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

  return (
    <div className="flex flex-col items-center min-h-full pt-20 md:p-7 md:mt-20">
      <h1 className="md:text-4xl font-medium pb-6">밴픽 시뮬레이터</h1>
      <form
        className="md:grid md:grid-cols-[1fr_2fr_1fr] md:justify-between md:gap-20 h-full flex flex-col items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* 블루팀 */}
        <div className="hidden md:flex flex-col justify-center items-center gap-6 w-[230px]">
          <div className="relative w-[230px] h-[230px] cursor-pointer" onClick={() => openPopup(teamSideOptions.BLUE)}>
            <NextImage
              sizes="(max-width: 768px) 100vw, 230px"
              className="object-contain"
              src={blueImage}
              alt="blueteam_logo"
              fill
              priority
              quality={90} // 품질 명시
            />
            <HoverCards
              message={'로고를 클릭하면 로고를 변경할 수 있습니다.'}
              side="right"
              contentClass="text-xs w-[250px] whitespace-pre-line"
              sideOffset={10}
            >
              <span className="absolute top-1 z-20 text-xs text-mainText cursor-pointer">
                <CircleHelp size={17} />
              </span>
            </HoverCards>
          </div>
          <h1 className="text-lg font-medium mb-2">{blueTeam}</h1>
          <input
            className="text-center p-3 bg-blue-800 rounded-md border-white placeholder-white w-full"
            {...register('blueTeamName')}
            placeholder="블루팀 이름을 입력해주세요."
          />
        </div>

        <div className="flex flex-col gap-10 min-w-[375px] md:w-[500px] ">
          <div>
            {/* 밴픽 모드 */}
            <div className="flex gap-1 items-center mb-2">
              <h1 className="flex justify-center text-sm md:text-lg font-medium md:block">밴픽 모드</h1>
              <HoverCards
                message={
                  '* 토너먼트드리프트 : 전통적인 밴픽 방식입니다. \n * 피어리스 : 이전 라운드에서 픽했던 챔피언을 다음 라운드에서 픽할 수 없습니다.'
                }
                contentClass="text-xs w-[420px] whitespace-pre-line"
                sideOffset={10}
              >
                <span className="text-xs text-mainText cursor-pointer">
                  <CircleHelp size={17} />
                </span>
              </HoverCards>
            </div>
            <div className="flex w-full justify-center gap-x-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm">
                <input type="radio" value="tournament" {...register('banpickMode')} defaultChecked />
                토너먼트 드리프트
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm">
                <input type="radio" value="peerless3" {...register('banpickMode')} />
                피어리스(3라운드)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm">
                <input type="radio" value="peerless5" {...register('banpickMode')} />
                피어리스(5라운드)
              </label>
            </div>
          </div>

          {/* 참여 모드 */}
          <div>
            <div className="flex gap-1 items-center mb-2">
              <h1 className="flex justify-center text-sm md:text-lg font-medium md:block">참여 모드</h1>
              <HoverCards
                message={
                  '* 솔로모드 : 혼자서 레드와 블루 밴픽을 진행합니다. \n * 팀모드 : 상대방을 초대하여 선택한 팀으로 밴픽을 진행합니다.'
                }
                contentClass="text-xs w-[330px] whitespace-pre-line"
                sideOffset={10}
              >
                <span className="text-xs text-mainText cursor-pointer">
                  <CircleHelp size={17} />
                </span>
              </HoverCards>
            </div>
            <div className="flex w-full justify-center gap-x-32">
              <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm">
                <input type="radio" value="solo" {...register('peopleMode')} defaultChecked />
                솔로모드
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm">
                <input type="radio" value="team" {...register('peopleMode')} />
                팀모드
              </label>
            </div>
          </div>

          {/* 시간제한 */}
          {selectedMode === 'solo' && (
            <div>
              <div className="flex gap-1 items-center mb-2">
                <h1 className="flex justify-center text-sm md:text-lg font-medium md:block">시간 설정</h1>
                <HoverCards
                  message={
                    '* 무제한 : 솔로모드에서 시간제한 없이 밴픽할 수 있습니다. \n * 제한 : 솔로모드에서 30초 제한으로 밴픽을 진행합니다. \n - 팀모드는 시간설정변경 불가능합니다.'
                  }
                  contentClass="text-xs w-[320px] whitespace-pre-line"
                  sideOffset={10}
                >
                  <span className="text-xs text-mainText cursor-pointer">
                    <CircleHelp size={17} />
                  </span>
                </HoverCards>
              </div>
              <div className="flex w-full justify-center gap-x-32">
                <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm">
                  <input type="radio" value="true" {...register('timeUnlimited')} defaultChecked />∞
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm">
                  <input type="radio" value="false" {...register('timeUnlimited')} />
                  30초
                </label>
              </div>
            </div>
          )}

          {/* 진영선택 */}
          {selectedMode !== 'solo' && (
            <div>
              <div className="flex gap-1 items-center mb-2">
                <h1 className="flex justify-center text-sm md:text-lg font-medium md:block">진영</h1>
                <HoverCards
                  message={
                    '* 블루진영 : 상대방이 레드진영이 됩니다. \n * 레드진영 : 상대방이 블루진영이 됩니다. \n - 피어리스 모드는 진영변경이 가능합니다.'
                  }
                  contentClass="text-xs w-[240px] whitespace-pre-line"
                  sideOffset={10}
                >
                  <span className="text-xs text-mainText cursor-pointer">
                    <CircleHelp size={17} />
                  </span>
                </HoverCards>
              </div>
              <div className="flex w-full justify-center gap-x-32">
                <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm">
                  <input type="radio" value="blue" {...register('myTeamSide')} defaultChecked />
                  블루진영
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm">
                  <input type="radio" value="red" {...register('myTeamSide')} />
                  레드진영
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-center items-center">
            <Button
              type={'submit'}
              className={
                'text-xs md:text-base w-2/3 md:w-full border border-mainText text-mainText p-3 rounded-md font-medium md:hover:bg-gray-500 transition'
              }
              text={'시작하기'}
            />
          </div>
        </div>

        {/* 레드팀 */}
        <div className="hidden md:flex flex-col justify-center items-center gap-6 w-[230px]">
          <div className="relative w-[230px] h-[230px] cursor-pointer" onClick={() => openPopup(teamSideOptions.RED)}>
            <NextImage
              sizes="230px"
              className="object-contain"
              src={redImage}
              alt="redteam_logo"
              priority
              fill
              quality={90} // 품질 명시
            />
          </div>
          <h1 className="text-lg font-medium mb-2">{redTeam}</h1>
          <input
            className="text-center p-3 bg-red-800 rounded-md border-white placeholder-white w-full"
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
