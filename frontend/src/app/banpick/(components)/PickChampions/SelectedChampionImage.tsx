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
              placeholder="blur"
              blurDataURL={'/images/default_champ.png'} // 사전 생성된 저해상도 이미지
              loading="eager" // 바로 로드
              fill
              sizes="h-10"
              style={{ objectFit: 'cover', objectPosition: 'top' }}
              className="scale-[100%]"
              alt=""
              priority={true} // 즉시 로드
            />
            <span className="relative m-2 text-lg">
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
