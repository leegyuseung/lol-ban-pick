'use client';
import Image from 'next/image';
import { useBanStore, useBanTeamStore, useRulesStore } from '@/store';
import { useState, useEffect, useRef } from 'react';
import { InfoType } from '@/types/types';

export default function BanPickHeader() {
  const { banpickMode, timeUnlimited, nowSet, role } = useRulesStore();
  const { selectedTeam, selectedTeamIndex, headerSecond, setHeaderSecond } = useBanStore();
  const { TeamRandomPick } = useBanTeamStore();
  const [currentColor, setCurrentColor] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondRef = useRef(headerSecond);
  const InfoDataRef = useRef<InfoType>();

  useEffect(() => {
    const initialState = useRulesStore.getState();
    const { hostInfo, guestInfo, role } = initialState;

    if (role === 'host') {
      InfoDataRef.current = hostInfo;
    } else if (role === 'guest') {
      InfoDataRef.current = guestInfo;
    } else if (role === 'audience') {
      InfoDataRef.current = {
        myTeam: '',
        yourTeam: '',
        myTeamSide: 'audience',
        yourTeamSide: 'audience',
        myImg: '',
        yourImg: '',
      };
    }

    const unsubscribe = useRulesStore.subscribe((state) => {
      const { hostInfo, guestInfo, role } = state;
      console.log('🍎unsubscribe', hostInfo, guestInfo, role);
      if (role === 'host') {
        InfoDataRef.current = hostInfo;
      } else if (role === 'guest') {
        InfoDataRef.current = guestInfo;
      } else if (role === 'audience') {
        InfoDataRef.current = {
          myTeam: '',
          yourTeam: '',
          myTeamSide: 'audience',
          yourTeamSide: 'audience',
          myImg: '',
          yourImg: '',
        };
      }
    });

    // cleanup 함수
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setHeaderSecond(timeUnlimited === 'true' ? '∞' : '5');
  }, [timeUnlimited]);

  // 시간
  useEffect(() => {
    if (timeUnlimited === 'true' || headerSecond === '') return;

    timerRef.current = setInterval(() => {
      if (secondRef.current === '0') {
        // 30초가 그냥 지나갈 경우 랜덤픽으로 넣어야한다
        if (selectedTeam[selectedTeamIndex].color !== InfoDataRef.current?.myTeamSide) {
          TeamRandomPick();
        } else {
          secondRef.current = '5';
          setHeaderSecond('5');
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

    if (selectedTeam[selectedTeamIndex].color === '') {
      setHeaderSecond('');
      setCurrentColor(selectedTeam[selectedTeamIndex].color);
    } else if (selectedTeam[selectedTeamIndex].color === 'blue' || selectedTeam[selectedTeamIndex].color === 'red') {
      if (timeUnlimited !== 'true') {
        secondRef.current = '5';
        setHeaderSecond('5');
      } else {
        secondRef.current = '∞';
        setHeaderSecond('∞');
      }
      setCurrentColor(selectedTeam[selectedTeamIndex].color);
    }
  }, [selectedTeamIndex]);

  return (
    <div className="flex h-20  text-white">
      <div className="flex-[3] flex flex-col justify-center items-center">
        <div className="flex h-[65px] w-full justify-between items-center">
          <div className="relative w-[80px] h-[65px] ml-10">
            {InfoDataRef.current?.myTeamSide === 'blue'
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
          {InfoDataRef.current?.myTeamSide === 'blue' ? (
            <span className="text-2xl mr-10">{InfoDataRef.current?.myTeam}</span>
          ) : (
            <span className="text-2xl mr-10">{InfoDataRef.current?.yourTeam}</span>
          )}
        </div>
        <div className="flex-[1] w-full relative overflow-hidden h-4">
          <div
            className={`absolute top-0 right-0 h-full w-full ${currentColor === 'blue' ? 'bg-blue-500 animate-fill-left-half' : ''}`}
          />
        </div>
      </div>
      <div className="flex-[1] flex flex-col justify-center items-center">
        <span className="text-xs">{banpickMode === 'tournament' ? '드리프트 토너먼트' : `${nowSet} 세트`}</span>
        <span className="text-3xl">{`:${headerSecond}`}</span>
      </div>
      <div className="flex-[3] flex flex-col justify-center items-center">
        <div className="flex h-[65px] w-full justify-between items-center">
          {InfoDataRef.current?.myTeamSide === 'blue' ? (
            <span className="text-2xl ml-10">{InfoDataRef.current?.yourTeam}</span>
          ) : (
            <span className="text-2xl ml-10">{InfoDataRef.current?.myTeam}</span>
          )}
          <div className="relative w-[80px] h-[65px] mr-10">
            {InfoDataRef.current?.myTeamSide === 'blue'
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
            className={`absolute top-0 left-0 h-full w-full ${currentColor === 'red' ? 'bg-red-500 animate-fill-right-half' : ''}`}
          />
        </div>
      </div>
    </div>
  );
}
