'use client';
import { useBanpickStore } from '@/store';
import ImageComp from '@/components/Image';
import { useEffect } from 'react';

interface ChampType extends Record<string, unknown> {
  imagePath: string;
}

export default function Banpick() {
  const { championInfo, setChampionInfo } = useBanpickStore();

  useEffect(() => {
    setChampionInfo();
  }, []);

  return (
    <div className=" flex flex-wrap justify-start gap-2">
      {Object.entries(championInfo).map(([name, info], idx) => (
        <div key={idx} className='w-16'>
          <ImageComp
            src={`https://ddragon.leagueoflegends.com/cdn/${(info as ChampType).version}/img/champion/${name}.png`}
          />
          <p className="text-center text-white">{name}</p>
        </div>
      ))}
    </div>
  );
}
