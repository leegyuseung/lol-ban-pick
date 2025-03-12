'use client';
import ImageComp from '@/components/Image';
import Image from 'next/image';
import { useBanpickStore } from '@/store';
import { useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SelectChampions() {
  const { championInfo, setChampionInfo } = useBanpickStore();

  useEffect(() => {
    setChampionInfo();
  }, []);

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
          <div className="w-[70px] flex flex-col items-center hover:opacity-50" key={idx}>
            <ImageComp
              className="border border-mainGold cursor-pointer hover:"
              width={60}
              height={60}
              src={`https://ddragon.leagueoflegends.com/cdn/${info.version}/img/champion/${name}.png`}
            />
            <p className="text-[9px] text-center text-mainText">{info.name}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button className="h-8 px-8 text-mainText bg-mainGold font-medium text-xs rounded-sm hover:bg-opacity-65">
          챔피언 선택
        </button>
      </div>
    </div>
  );
}
