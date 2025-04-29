import Image from 'next/image';
import { SelectedChampionImagePropsI } from '@/types';
import { sideOptions } from '@/constants';

export default function SelectedBanImage({
  banPickObject,
  currentLocation,
  currentSelectedPick,
  index,
  side,
  location,
}: SelectedChampionImagePropsI) {
  return (
    <div>
      {(banPickObject[index].use ||
        (currentLocation === banPickObject[index].location && currentSelectedPick[0].name !== '')) &&
        side === location && (
          <Image
            src={
              banPickObject[index].use
                ? banPickObject[index].random
                  ? `/images/default_champ.png`
                  : `https://ddragon.leagueoflegends.com/cdn/${banPickObject[index]?.info.version}/img/champion/${banPickObject[index]?.name}.png`
                : currentLocation === banPickObject[index].location
                  ? `https://ddragon.leagueoflegends.com/cdn/${currentSelectedPick[0]?.info.version}/img/champion/${currentSelectedPick[0]?.name}.png`
                  : ``
            }
            width={60}
            height={60}
            alt=""
          />
        )}
      {side === location && (
        <div
          className={`${location === sideOptions.LEFT ? 'bg-blueLineColor' : 'bg-redLineColor'} ${currentLocation === banPickObject[index].location ? (location === sideOptions.RIGHT ? 'absolute h-[5px] top-0 right-0 w-full z-10' : 'absolute h-[5px] top-0 left-0 w-full z-10') : ''}`}
        />
      )}
    </div>
  );
}
