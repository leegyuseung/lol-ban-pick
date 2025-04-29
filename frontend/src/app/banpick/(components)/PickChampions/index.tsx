'use client';
import SelectedChampionImage from '@/app/banpick/(components)/PickChampions/SelectedChampionImage';
import SelectedBanImage from '@/app/banpick/(components)/PickChampions/SelectedBanImage';
import MiniIcon from '@/components/MiniIcon';
import { useBanStore } from '@/store';
import { lineOptions, sideOptions } from '@/constants';

type PropsType = {
  side: string;
};

// SelectChampions 부분에서 선택하면 이미지 렌더링
export default function PickChampions({ side }: PropsType) {
  const { currentSelectedPick, banPickObject, currentLocation } = useBanStore();
  return (
    <div className="flex flex-col flex-[3] m-1">
      {/* 상단부 */}
      <div className="flex flex-col flex-[2]">
        <div
          className={`relative overflow-hidden w-full h-10 flex flex-[1] border border-mainGold ${side === sideOptions.LEFT ? 'justify-end items-end' : 'items-end'}`}
        >
          <MiniIcon
            className={`absolute ${side === sideOptions.LEFT ? 'left-0' : 'right-0'} z-10  m-2`}
            src={`/images/icon-position-top.png`}
            alt={lineOptions.TOP}
            width={20}
            height={20}
          />

          <SelectedChampionImage
            banPickObject={banPickObject}
            currentLocation={currentLocation}
            currentSelectedPick={currentSelectedPick}
            index={6}
            side={side}
            location={sideOptions.LEFT}
          />

          <SelectedChampionImage
            banPickObject={banPickObject}
            currentLocation={currentLocation}
            currentSelectedPick={currentSelectedPick}
            index={7}
            side={side}
            location={sideOptions.RIGHT}
          />
        </div>
        <div
          className={`relative overflow-hidden w-full h-10 flex flex-[1] border border-mainGold ${side === sideOptions.LEFT ? 'justify-end items-end' : 'items-end'}`}
        >
          <MiniIcon
            className={`absolute ${side === sideOptions.LEFT ? 'left-0' : 'right-0'} z-10  m-2`}
            src={`/images/icon-position-jungle.png`}
            alt={lineOptions.JUG}
            width={20}
            height={20}
          />

          <SelectedChampionImage
            banPickObject={banPickObject}
            currentLocation={currentLocation}
            currentSelectedPick={currentSelectedPick}
            index={9}
            side={side}
            location={sideOptions.LEFT}
          />

          <SelectedChampionImage
            banPickObject={banPickObject}
            currentLocation={currentLocation}
            currentSelectedPick={currentSelectedPick}
            index={8}
            side={side}
            location={sideOptions.RIGHT}
          />
        </div>
        <div
          className={`relative overflow-hidden w-full h-10 flex flex-[1] border border-mainGold ${side === sideOptions.LEFT ? 'justify-end items-end' : 'items-end'}`}
        >
          <MiniIcon
            className={`absolute ${side === sideOptions.LEFT ? 'left-0' : 'right-0'} z-10  m-2`}
            src={`/images/icon-position-mid.png`}
            alt={lineOptions.MID}
            width={20}
            height={20}
          />

          <SelectedChampionImage
            banPickObject={banPickObject}
            currentLocation={currentLocation}
            currentSelectedPick={currentSelectedPick}
            index={10}
            side={side}
            location={sideOptions.LEFT}
          />
          <SelectedChampionImage
            banPickObject={banPickObject}
            currentLocation={currentLocation}
            currentSelectedPick={currentSelectedPick}
            index={11}
            side={side}
            location={sideOptions.RIGHT}
          />
        </div>
        <div
          className={`relative overflow-hidden w-full h-10 flex flex-[1] border border-mainGold ${side === sideOptions.LEFT ? 'justify-end items-end' : 'items-end'}`}
        >
          <MiniIcon
            className={`absolute ${side === sideOptions.LEFT ? 'left-0' : 'right-0'} z-10  m-2`}
            src={`/images/icon-position-ad.png`}
            alt={lineOptions.AD}
            width={20}
            height={20}
          />

          <SelectedChampionImage
            banPickObject={banPickObject}
            currentLocation={currentLocation}
            currentSelectedPick={currentSelectedPick}
            index={17}
            side={side}
            location={sideOptions.LEFT}
          />
          <SelectedChampionImage
            banPickObject={banPickObject}
            currentLocation={currentLocation}
            currentSelectedPick={currentSelectedPick}
            index={16}
            side={side}
            location={sideOptions.RIGHT}
          />
        </div>
        <div
          className={`relative overflow-hidden w-full h-10 flex flex-[1] border border-mainGold ${side === sideOptions.LEFT ? 'justify-end items-end' : 'items-end'}`}
        >
          <MiniIcon
            className={`absolute ${side === sideOptions.LEFT ? 'left-0' : 'right-0'} z-10  m-2`}
            src={`/images/icon-position-sup.png`}
            alt={lineOptions.SUP}
            width={20}
            height={20}
          />

          <SelectedChampionImage
            banPickObject={banPickObject}
            currentLocation={currentLocation}
            currentSelectedPick={currentSelectedPick}
            index={18}
            side={side}
            location={sideOptions.LEFT}
          />

          <SelectedChampionImage
            banPickObject={banPickObject}
            currentLocation={currentLocation}
            currentSelectedPick={currentSelectedPick}
            index={19}
            side={side}
            location={sideOptions.RIGHT}
          />
        </div>
      </div>

      {/* 하단부 */}
      <div className="flex flex-col flex-[1] gap-2 pt-5">
        <div className="flex gap-2 justify-center w-full">
          <div className="relative border border-mainGold w-[60px] h-[60px]">
            <SelectedBanImage
              banPickObject={banPickObject}
              currentLocation={currentLocation}
              currentSelectedPick={currentSelectedPick}
              index={0}
              side={side}
              location={sideOptions.LEFT}
            />

            <SelectedBanImage
              banPickObject={banPickObject}
              currentLocation={currentLocation}
              currentSelectedPick={currentSelectedPick}
              index={1}
              side={side}
              location={sideOptions.RIGHT}
            />
          </div>
          <div className="relative border border-mainGold w-[60px] h-[60px]">
            <SelectedBanImage
              banPickObject={banPickObject}
              currentLocation={currentLocation}
              currentSelectedPick={currentSelectedPick}
              index={2}
              side={side}
              location={sideOptions.LEFT}
            />
            <SelectedBanImage
              banPickObject={banPickObject}
              currentLocation={currentLocation}
              currentSelectedPick={currentSelectedPick}
              index={3}
              side={side}
              location={sideOptions.RIGHT}
            />
          </div>
          <div className="relative border border-mainGold w-[60px] h-[60px]">
            <SelectedBanImage
              banPickObject={banPickObject}
              currentLocation={currentLocation}
              currentSelectedPick={currentSelectedPick}
              index={4}
              side={side}
              location={sideOptions.LEFT}
            />
            <SelectedBanImage
              banPickObject={banPickObject}
              currentLocation={currentLocation}
              currentSelectedPick={currentSelectedPick}
              index={5}
              side={side}
              location={sideOptions.RIGHT}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-center w-full">
          <div className="relative border border-mainGold w-[60px] h-[60px]">
            <SelectedBanImage
              banPickObject={banPickObject}
              currentLocation={currentLocation}
              currentSelectedPick={currentSelectedPick}
              index={13}
              side={side}
              location={sideOptions.LEFT}
            />
            <SelectedBanImage
              banPickObject={banPickObject}
              currentLocation={currentLocation}
              currentSelectedPick={currentSelectedPick}
              index={12}
              side={side}
              location={sideOptions.RIGHT}
            />
          </div>
          <div className="relative border border-mainGold w-[60px] h-[60px]">
            <SelectedBanImage
              banPickObject={banPickObject}
              currentLocation={currentLocation}
              currentSelectedPick={currentSelectedPick}
              index={15}
              side={side}
              location={sideOptions.LEFT}
            />
            <SelectedBanImage
              banPickObject={banPickObject}
              currentLocation={currentLocation}
              currentSelectedPick={currentSelectedPick}
              index={14}
              side={side}
              location={sideOptions.RIGHT}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
