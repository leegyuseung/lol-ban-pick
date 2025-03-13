import Image from 'next/image';
import { BanPickObjectType, currentSelectedPickType } from '@/store/banpick';

interface SelectedChampionImageProps {
  banPickObject: BanPickObjectType;
  currentLocation: string;
  currentSelectedPick: currentSelectedPickType;
  index: number;
  side: string;
  location: string;
}

export default function SelectedChampionImage({
  banPickObject,
  currentLocation,
  currentSelectedPick,
  index,
  side,
  location,
}: SelectedChampionImageProps) {
  return (
    (banPickObject[index].use ||
      (currentLocation === banPickObject[index].location && currentSelectedPick.length > 0)) &&
    side === location && (
      <Image
        src={
          banPickObject[index].use
            ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${banPickObject[index]?.name}_0.jpg`
            : currentLocation === banPickObject[index].location
              ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentSelectedPick[0]?.name}_0.jpg`
              : ``
        }
        layout="fill"
        objectFit="cover"
        objectPosition="top"
        className="scale-[100%]"
        alt=""
      />
    )
  );
}
