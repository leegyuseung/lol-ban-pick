'use client';
import ImageComp from '@/components/Image';
import { useBanpickStore } from '@/store';
import { useEffect } from 'react';

export default function SelectChampions() {
  const { championInfo, setChampionInfo } = useBanpickStore();

  useEffect(() => {
    setChampionInfo();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end mr-3">
        <input
          className="text-mainText text-xs px-3 py-2 bg-transparent border border-subGold focus:ring-0 focus:border-subGold focus:outline-none placeholder:text-xs placeholder:text-mainText"
          placeholder="검색"
        />
      </div>
      <div className="grid grid-cols-7 overflow-auto h-[365px]">
        {Object.entries(championInfo).map(([name, info], idx) => (
          <div className="w-[70px] flex flex-col items-center" key={idx}>
            <ImageComp
              className="border border-mainGold"
              width={60}
              height={60}
              src={`https://ddragon.leagueoflegends.com/cdn/${info.version}/img/champion/${name}.png`}
            />
            <p className="text-[9px] text-center text-mainText">{info.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
