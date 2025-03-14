'use client';
import Image from 'next/image';
import { useBanStore, useRulesStore } from '@/store';
import { useState, useEffect, useRef } from 'react';

export default function BanPickHeader() {
  const { blueTeam, redTeam, banpickMode, timeUnlimited } = useRulesStore();
  const { selectedTeam, selectedTeamIndex, RandomPick } = useBanStore();

  const [second, setSecond] = useState(timeUnlimited == 'true' ? '∞' : '5');
  const [currentColor, setCurrentColor] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondRef = useRef(second);

  useEffect(() => {
    secondRef.current = second;
  }, [second]);

  // 시간
  useEffect(() => {
    if (timeUnlimited === 'true' || second === '') return;

    timerRef.current = setInterval(() => {
      if (secondRef.current === '0') {
        // 30초가 그냥 지나갈 경우 랜덤픽으로 넣어야한다
        RandomPick();
        secondRef.current = '5';
        setSecond('5');
      } else {
        secondRef.current = String(Number(secondRef.current) - 1);
        setSecond(secondRef.current);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [second]);

  // 색상변경
  useEffect(() => {
    if (!selectedTeam[selectedTeamIndex]) return;

    if (selectedTeam[selectedTeamIndex].color === '') {
      setTimeout(() => setSecond(''), 0);
      setCurrentColor(selectedTeam[selectedTeamIndex].color);
    } else if (selectedTeam[selectedTeamIndex].color === 'blue' || selectedTeam[selectedTeamIndex].color === 'red') {
      if (timeUnlimited !== 'true') {
        secondRef.current = '5';
        setSecond('5');
      }
      setCurrentColor(selectedTeam[selectedTeamIndex].color);
    }
  }, [selectedTeamIndex]);

  return (
    <div className="flex h-20  text-white">
      <div className="flex-[3] flex flex-col justify-center items-center">
        <div className="flex flex-[4] w-full justify-between items-center">
          <Image className="ml-10" src="/images/t1.png" alt="logo" width={80} height={31.56} />
          <span className="text-2xl mr-10">{blueTeam}</span>
        </div>
        <div className="flex-[1] w-full relative overflow-hidden">
          <div
            className={`absolute top-0 right-0 h-full w-full ${currentColor === 'blue' ? 'bg-blue-500 animate-fill-left-half' : ''}`}
          ></div>
        </div>
      </div>
      <div className="flex-[1] flex flex-col justify-center items-center">
        <span className="text-xs">{banpickMode === 'tournament' ? '드리프트 토너먼트' : '피어리스'}</span>
        <span className="text-3xl">{`:${second}`}</span>
      </div>
      <div className="flex-[3] flex flex-col justify-center items-center">
        <div className="flex flex-[4] w-full items-center justify-between">
          <span className="text-2xl ml-10">{redTeam}</span>
          <Image className="mr-10" src="/images/t1.png" alt="logo" width={80} height={31.56} />
        </div>
        <div className="flex-[1] w-full relative overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full w-full ${currentColor === 'red' ? 'bg-red-500 animate-fill-right-half' : ''}`}
          ></div>
        </div>
      </div>
    </div>
  );
}
