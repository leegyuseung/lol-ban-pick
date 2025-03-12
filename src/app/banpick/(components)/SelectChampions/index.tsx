'use client';
import Image from 'next/image';
import { useBanpickStore, useBanStore, useHeaderStore } from '@/store';
import { useEffect, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { InfoI } from '@/types/types';

export default function SelectChampions() {
  const { championInfo, setChampionInfo } = useBanpickStore();
  const { setSelectedTeamIndex } = useHeaderStore();
  const {
    clearCurrentSelectedPick,
    setCureentSelectedPick,
    setCurrentLocation,
    currentLocation,
    setBanPickObject,
    banPickObject,
  } = useBanStore();
  const [pickname, setPickName] = useState('');
  const [pickObject, setPickObject] = useState<InfoI>({
    blurb: '',
    id: '',
    key: '',
    name: '',
    partype: '',
    tags: [],
    title: '',
    version: '',
  });
  useEffect(() => {
    setChampionInfo();
  }, []);

  const onClick = (pickName: string, info: InfoI) => {
    setCureentSelectedPick(pickName, info);
    setPickName(pickName);
    setPickObject(info);
  };

  const onClickButton = () => {
    let index = banPickObject.find((value) => value.location === currentLocation)?.index as number;

    setBanPickObject(index, pickname, pickObject);
    index++;
    setCurrentLocation(index);
    clearCurrentSelectedPick();
    setSelectedTeamIndex();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 mt-2 ml-2">
          <Image src="/images/icon-position-top.png" alt="top" width={20} height={20} />
          <Image src="/images/icon-position-jungle.png" alt="jungle" width={20} height={20} />
          <Image src="/images/icon-position-middle.png" alt="middle" width={20} height={20} />
          <Image src="/images/icon-position-bottom.png" alt="bottom" width={20} height={20} />
          <Image src="/images/icon-position-utility.png" alt="utility" width={20} height={20} />
        </div>
        <div className="flex items-center border border-subGold w-full max-w-[200px] px-3">
          <FaSearch className="text-mainText text-sm mr-2" />
          <input
            className="text-mainText text-xs w-full py-2 bg-transparent focus:ring-0 focus:border-subGold focus:outline-none placeholder:text-xs placeholder:text-mainText"
            placeholder="검색"
          />
        </div>
      </div>
      <div className="grid grid-cols-7 overflow-auto h-[365px]">
        {Object.entries(championInfo).map(([name, info], idx) => (
          <div
            className={`w-[70px] flex flex-col items-center cursor-pointer hover:opacity-50 ${name === pickname ? 'opacity-20' : ''}`}
            key={idx}
          >
            <Image
              alt="champion"
              className="border border-mainGold"
              width={60}
              height={60}
              src={`https://ddragon.leagueoflegends.com/cdn/${info.version}/img/champion/${name}.png`}
              onClick={() => onClick(name, info)}
            />
            <p className="text-[9px] text-center text-mainText">{info.name}</p>
            {name === pickname && <FaTimes className="absolute text-6xl text-red-500" />}
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          onClick={onClickButton}
          className="h-8 px-8 text-mainText bg-mainGold font-medium text-xs rounded-sm hover:bg-opacity-65"
        >
          챔피언 선택
        </button>
      </div>
    </div>
  );
}
