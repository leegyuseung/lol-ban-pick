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
    <div className=" flex flex-wrap justify-start gap-2">
      {Object.entries(championInfo).map(([name, info], idx) => (
        <div key={idx}>
          <ImageComp src={`https://ddragon.leagueoflegends.com/cdn/${info.version}/img/champion/${name}.png`} />
          <p className="text-xs text-center text-mainText">{info.name}</p>
        </div>
      ))}
    </div>
  );
}
