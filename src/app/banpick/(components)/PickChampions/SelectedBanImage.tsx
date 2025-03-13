import Image from 'next/image';
import { BanPickObjectType, currentSelectedPickType } from '@/store/banpick';

interface SelectedChampionImageProps {
  banPickObject: BanPickObjectType;
  currentLocation: string;
  currentSelectedPick: currentSelectedPickType;
  index: number;
  side?: string;
  location?: string;
}

export default function SelectedBanImage({
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
            ? `https://ddragon.leagueoflegends.com/cdn/${banPickObject[index]?.info.version}/img/champion/${banPickObject[index]?.name}.png`
            : currentLocation === banPickObject[index].location
              ? `https://ddragon.leagueoflegends.com/cdn/${currentSelectedPick[0]?.info.version}/img/champion/${currentSelectedPick[0]?.name}.png`
              : ``
        }
        width={60}
        height={60}
        alt=""
      />
    )
  );
}
