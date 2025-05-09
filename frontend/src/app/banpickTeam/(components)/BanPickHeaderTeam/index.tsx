'use client';
import Image from 'next/image';
import { useBanStore, useBanTeamStore, useRulesStore } from '@/store';
import { useState, useEffect, useRef } from 'react';
import { InfoType } from '@/types';
import { banPickModeOptions, booleanOptions, roleOptions, teamcolorOptions, teamSideOptions } from '@/constants';

export default function BanPickHeader() {
  const { banpickMode, timeUnlimited, nowSet } = useRulesStore();
  const { selectedTeam, selectedTeamIndex, headerSecond, setHeaderSecond } = useBanStore();
  const { TeamRandomPick } = useBanTeamStore();
  const [currentColor, setCurrentColor] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondRef = useRef(headerSecond);
  const InfoDataRef = useRef<InfoType>();

  useEffect(() => {
    const initialState = useRulesStore.getState();
    const { hostInfo, guestInfo, role } = initialState;

    if (role === roleOptions.HOST) {
      InfoDataRef.current = hostInfo;
    } else if (role === roleOptions.GUEST) {
      InfoDataRef.current = guestInfo;
    } else if (role === roleOptions.AUD) {
      InfoDataRef.current = {
        myTeam: '',
        yourTeam: '',
        myTeamSide: teamSideOptions.AUD,
        yourTeamSide: teamSideOptions.AUD,
        myImg: '',
        yourImg: '',
      };
    }

    const unsubscribe = useRulesStore.subscribe((state) => {
      const { hostInfo, guestInfo, role } = state;
      if (role === roleOptions.HOST) {
        InfoDataRef.current = hostInfo;
      } else if (role === roleOptions.GUEST) {
        InfoDataRef.current = guestInfo;
      } else if (role === roleOptions.AUD) {
        InfoDataRef.current = {
          myTeam: hostInfo.myTeam,
          yourTeam: hostInfo.yourTeam,
          myTeamSide: teamSideOptions.AUD,
          yourTeamSide: teamSideOptions.AUD,
          myImg: hostInfo.myImg,
          yourImg: hostInfo.yourImg,
        };
      }
    });

    // cleanup 함수
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setHeaderSecond(timeUnlimited === booleanOptions.TRUE ? '∞' : '30');
  }, [timeUnlimited]);

  // 시간
  useEffect(() => {
    if (timeUnlimited === booleanOptions.TRUE || headerSecond === '') return;

    timerRef.current = setInterval(() => {
      if (secondRef.current === '0') {
        // 30초가 그냥 지나갈 경우 랜덤픽으로 넣어야한다
        if (selectedTeam[selectedTeamIndex].color !== InfoDataRef.current?.myTeamSide) {
          TeamRandomPick();
        } else {
          secondRef.current = '30';
          setHeaderSecond('30');
        }
      } else {
        secondRef.current = String(Number(secondRef.current) - 1);
        setHeaderSecond(secondRef.current);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [headerSecond, timeUnlimited]);

  // 색상변경
  useEffect(() => {
    if (!selectedTeam[selectedTeamIndex]) return;

    if (selectedTeam[selectedTeamIndex].color === teamcolorOptions.NO) {
      setHeaderSecond('');
      setCurrentColor(selectedTeam[selectedTeamIndex].color);
    } else if (
      selectedTeam[selectedTeamIndex].color === teamcolorOptions.BLUE ||
      selectedTeam[selectedTeamIndex].color === teamcolorOptions.RED
    ) {
      if (timeUnlimited !== booleanOptions.TRUE) {
        secondRef.current = '30';
        setHeaderSecond('30');
      } else {
        secondRef.current = '∞';
        setHeaderSecond('∞');
      }
      setCurrentColor(selectedTeam[selectedTeamIndex].color);
    }
  }, [selectedTeamIndex]);

  return (
    <div className="flex min-h-[70px] md:min-h-[80px]  text-white">
      <div className="flex-[3] flex flex-col justify-center items-center">
        <div className="flex h-[65px] w-full justify-between items-center">
          <div className="hidden md:flex relative w-[80px] h-[65px] ml-10">
            {InfoDataRef.current?.myTeamSide === teamSideOptions.BLUE
              ? InfoDataRef.current?.myImg && (
                  <Image
                    sizes="w-[80px] h-[65px]"
                    className="object-contain"
                    src={InfoDataRef.current?.myImg}
                    alt="logo"
                    fill
                    priority
                  />
                )
              : InfoDataRef.current?.yourImg && (
                  <Image
                    sizes="w-[80px] h-[65px]"
                    className="object-contain"
                    src={InfoDataRef.current?.yourImg}
                    alt="logo"
                    fill
                    priority
                  />
                )}
          </div>
          {InfoDataRef.current?.myTeamSide === teamSideOptions.BLUE ? (
            <span className="md:text-2xl md:mr-15 ml-5">{InfoDataRef.current?.myTeam}</span>
          ) : (
            <span className="md:text-2xl md:mr-15 ml-5">{InfoDataRef.current?.yourTeam}</span>
          )}
        </div>
        <div className="flex-[1] w-full relative overflow-hidden h-4">
          <div
            className={`absolute top-0 right-0 h-full w-full ${currentColor === teamSideOptions.BLUE ? 'bg-blue-500 animate-fill-left-half' : ''}`}
          />
        </div>
      </div>
      <div className="flex-[1] flex flex-col justify-center items-center">
        <span className="text-xs">
          {banpickMode === banPickModeOptions.TNM ? '드리프트 토너먼트' : `${nowSet} 세트`}
        </span>
        <span className="md:text-3xl">{`:${headerSecond}`}</span>
      </div>
      <div className="flex-[3] flex flex-col justify-center items-center">
        <div className="flex h-[65px] w-full justify-end md:justify-between items-center">
          {InfoDataRef.current?.myTeamSide === teamSideOptions.BLUE ? (
            <span className="md:text-2xl md:ml-15 mr-5">{InfoDataRef.current?.yourTeam}</span>
          ) : (
            <span className="md:text-2xl md:ml-15 mr-5">{InfoDataRef.current?.myTeam}</span>
          )}
          <div className="hidden md:flex relative w-[80px] h-[65px] mr-10">
            {InfoDataRef.current?.myTeamSide === teamSideOptions.BLUE
              ? InfoDataRef.current?.yourImg && (
                  <Image
                    className="object-contain"
                    sizes="w-[80px] h-[65px]"
                    src={InfoDataRef.current?.yourImg}
                    alt="logo"
                    fill
                    priority
                  />
                )
              : InfoDataRef.current?.myImg && (
                  <Image
                    className="object-contain"
                    sizes="w-[80px] h-[65px]"
                    src={InfoDataRef.current?.myImg}
                    alt="logo"
                    fill
                    priority
                  />
                )}
          </div>
        </div>
        <div className="flex-[1] w-full relative overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full w-full ${currentColor === teamSideOptions.RED ? 'bg-red-500 animate-fill-right-half' : ''}`}
          />
        </div>
      </div>
    </div>
  );
}
