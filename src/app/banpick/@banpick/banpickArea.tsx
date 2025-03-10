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
      {/* TODO: 현재 cdn 방식으로 이미지를 로드할 수 있게 변경함
      하지만 추후에 이미지를 다시 사용할 수도 있어서 public/images/champions는 둠. 이후 사용하지 않으면 삭제 필 */}
      {Object.entries(championInfo).map(([name, info]: [string, ChampType], idx: number) => (
        <ImageComp src={`https://ddragon.leagueoflegends.com/cdn/${info.version}/img/champion/${name}.png`} key={idx} />
      ))}
    </div>
  );
}
