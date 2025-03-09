'use client';
import { useBanpickStore } from '@/app/_store';
import ImageComp from '@/components/Image';
import { useEffect } from 'react';

interface PropType {
  champs: {
    img: string;
  }[]; // champs는 Champ 배열
}
interface ChampType extends Record<string, unknown> {
  imagePath: string;
}

export default function Banpick({ champs }: PropType) {
  const { championInfo, setChampionInfo } = useBanpickStore();

  useEffect(() => {
    setChampionInfo();
  }, []);

  return (
    <div className="w-xl h-xl bg-red-50">
      {/* {JSON.stringify(championInfo)} */}
      {Object.values(championInfo).map((info: ChampType, idx: number) => (
        <ImageComp src={info.imagePath} key={idx} />
      ))}
    </div>
  );
}
