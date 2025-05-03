'use client';
import Image from 'next/image';
import { useBanStore, useRulesStore } from '@/store';
import { useState, useEffect, useRef } from 'react';
import { banPickModeOptions, booleanOptions, teamcolorOptions, teamSideOptions } from '@/constants';

export default function BanPickHeader() {
  const { hostInfo, banpickMode, timeUnlimited, nowSet } = useRulesStore();
  const { selectedTeam, selectedTeamIndex, RandomPick, headerSecond, setHeaderSecond } = useBanStore();
  const [currentColor, setCurrentColor] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondRef = useRef(headerSecond);

  useEffect(() => {
    setHeaderSecond(timeUnlimited === booleanOptions.TRUE ? '∞' : '30');
  }, [timeUnlimited]);

  // 시간
  useEffect(() => {
    if (timeUnlimited === booleanOptions.TRUE || headerSecond === '') return;

    timerRef.current = setInterval(() => {
      if (secondRef.current === '0') {
        // 30초가 그냥 지나갈 경우 랜덤픽으로 넣어야한다
        RandomPick();
        secondRef.current = '30';
        setHeaderSecond('30');
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
      setTimeout(() => setHeaderSecond(''), 0);
      setCurrentColor(selectedTeam[selectedTeamIndex].color);
    } else if (
      selectedTeam[selectedTeamIndex].color === teamSideOptions.BLUE ||
      selectedTeam[selectedTeamIndex].color === teamSideOptions.RED
    ) {
      if (timeUnlimited !== 'true') {
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
    <div className="flex min-h-[70px] md:min-h-[80px] text-white">
      <div className="flex-[3] flex flex-col justify-center items-center">
        <div className="flex h-[65px] w-full justify-between items-center">
          <div className="hidden md:flex relative w-[80px] h-[65px] ml-10">
            {hostInfo.myTeamSide === teamSideOptions.BLUE
              ? hostInfo.myImg && (
                  <Image
                    sizes="w-[80px] h-[65px]"
                    className="object-contain"
                    src={hostInfo.myImg}
                    alt="logo"
                    fill
                    priority
                  />
                )
              : hostInfo.yourImg && (
                  <Image
                    sizes="w-[80px] h-[65px]"
                    className="object-contain"
                    src={hostInfo.yourImg}
                    alt="logo"
                    fill
                    priority
                  />
                )}
          </div>
          {hostInfo.myTeamSide === teamSideOptions.BLUE ? (
            <span className="md:text-2xl md:mr-15 ml-5">{hostInfo.myTeam}</span>
          ) : (
            <span className="md:text-2xl md:mr-15 ml-5">{hostInfo.yourTeam}</span>
          )}
        </div>
        <div className="flex-[1] w-full relative overflow-hidden h-4 ">
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
          {hostInfo.myTeamSide === teamSideOptions.BLUE ? (
            <span className="md:text-2xl md:ml-15 mr-5">{hostInfo.yourTeam}</span>
          ) : (
            <span className="md:text-2xl md:ml-15 mr-5">{hostInfo.myTeam}</span>
          )}
          <div className="hidden md:flex relative w-[80px] h-[65px] mr-10">
            {hostInfo.myTeamSide === teamSideOptions.BLUE
              ? hostInfo.yourImg && (
                  <Image
                    className="object-contain"
                    sizes="w-[80px] h-[65px]"
                    src={hostInfo.yourImg}
                    alt="logo"
                    fill
                    priority
                  />
                )
              : hostInfo.myImg && (
                  <Image
                    className="object-contain"
                    sizes="w-[80px] h-[65px]"
                    src={hostInfo.myImg}
                    alt="logo"
                    fill
                    priority
                  />
                )}
          </div>
        </div>
        <div className="flex-[1] w-full relative overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full w-full ${currentColor === 'red' ? 'bg-red-500 animate-fill-right-half' : ''}`}
          />
        </div>
      </div>
    </div>
  );
}
