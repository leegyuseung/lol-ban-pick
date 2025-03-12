'use client';
import Image from 'next/image';
import { useBanStore, useRulesStore } from '@/store';
import { useState, useEffect, useRef } from 'react';

export default function BanPickHeader() {
  const { blueTeam, redTeam, banpickMode, timeUnlimited } = useRulesStore();
  const { selectedTeam } = useBanStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [second, setSecond] = useState(timeUnlimited == 'true' ? '∞' : '5');
  const [currentColor, setCurrentColor] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeUnlimited === 'true' || second === '') return;

    timerRef.current = setInterval(() => {
      setSecond((prev) => {
        if (prev === '0') {
          setCurrentIndex((prevIndex) => (prevIndex < selectedTeam.length - 1 ? prevIndex + 1 : prevIndex));
          return '5'; // 여기서 바로 30으로 바꿔줌
        }
        return String(Number(prev) - 1);
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [second]);

  useEffect(() => {
    if (selectedTeam[currentIndex] === '') {
      setSecond('');
    }
    const timeout = setTimeout(() => {
      setCurrentColor(selectedTeam[currentIndex]);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [currentIndex]);

  return (
    <div className="flex h-20  text-white">
      <div className="flex-[3] flex flex-col justify-center items-center">
        <div className="flex flex-[4] w-full justify-between items-center">
          <Image className="ml-10" src="/images/t1.png" alt="logo" width={80} height={80} />
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
          <Image className="mr-10" src="/images/t1.png" alt="logo" width={80} height={80} />
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
