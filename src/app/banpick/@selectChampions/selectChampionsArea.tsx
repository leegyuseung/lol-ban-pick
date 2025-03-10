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
    <div className="w-full h-3/5 bg-red-50">
      {Object.entries(championInfo).map(([name, info], idx) => (
        <ImageComp
          src={`https://ddragon.leagueoflegends.com/cdn/${(info as ChampType).version}/img/champion/${name}.png`}
          key={idx}
        />
      ))}
    </div>
  );
}
