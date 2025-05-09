import Image from 'next/image';
import { SelectedChampionImagePropsI } from '@/types';
import { sideOptions } from '@/constants';

export default function SelectedChampionImage({
  banPickObject,
  currentLocation,
  currentSelectedPick,
  index,
  side,
  location,
}: SelectedChampionImagePropsI) {
  console.log('test@@@@', banPickObject[index], currentSelectedPick[0]);
  return (
    <>
      {(banPickObject[index].use ||
        (currentLocation === banPickObject[index].location && currentSelectedPick[0].name !== '')) &&
        side === location && (
          <>
            <Image
              src={
                banPickObject[index].use
                  ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${banPickObject[index]?.name}_0.jpg`
                  : currentLocation === banPickObject[index].location
                    ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentSelectedPick[0]?.name}_0.jpg`
                    : ``
              }
              fill
              sizes="h-10"
              style={{
                objectFit: 'cover',
                objectPosition: banPickObject[index].use
                  ? banPickObject[index].info.Iposition
                  : currentLocation === banPickObject[index].location
                    ? currentSelectedPick[0].info.Iposition
                    : `top`,
              }}
              className="hidden md:flex scale-[100%]"
              alt=""
            />
            <span className="relative m-2 text-xs md:text-lg">
              {banPickObject[index].use
                ? banPickObject[index].info.name
                : currentLocation === banPickObject[index].location
                  ? currentSelectedPick[0].info.name
                  : ''}
            </span>
          </>
        )}
      {side === location && (
        <div
          className={`${location === sideOptions.LEFT ? 'bg-blueLineColor' : 'bg-redLineColor'} ${currentLocation === banPickObject[index].location ? (location === sideOptions.RIGHT ? 'absolute h-full top-0 right-0 w-[15px] z-10' : 'absolute h-full top-0 left-0 w-[15px] z-10') : ''}`}
        />
      )}
    </>
  );
}
