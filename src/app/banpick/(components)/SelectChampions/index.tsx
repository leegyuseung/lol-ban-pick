'use client';
import Image from 'next/image';
import { useBanpickStore, useBanStore, useHeaderStore } from '@/store';
import { useEffect, useState } from 'react';
import { FaSearch, FaTimes, FaCheck } from 'react-icons/fa';
import { ChampionInfoI } from '@/types/types';

export default function SelectChampions() {
  const { championInfo, setChampionInfo, setChangeChampionInfo } = useBanpickStore();
  const { setSelectedTeamIndex, selectedTeam, selectedTeamIndex } = useHeaderStore();
  const {
    clearCurrentSelectedPick,
    setCurrentSelectedPick,
    setCurrentLocation,
    currentLocation,
    setBanPickObject,
    banPickObject,
  } = useBanStore();
  const INITIAL_PICKOBJ = {
    blurb: '',
    id: '',
    key: '',
    name: '',
    partype: '',
    tags: [],
    title: '',
    version: '',
    status: '',
    line: [],
  };
  const [pickname, setPickName] = useState('');
  const [pickObject, setPickObject] = useState<ChampionInfoI>(INITIAL_PICKOBJ);
  const [filteredChampions, setFilteredChampions] = useState(championInfo);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  useEffect(() => {
    setChampionInfo();
  }, []);

  useEffect(() => {
    setFilteredChampions(championInfo); // 챔피언 정보가 변경될 때 필터링 데이터 초기화
    setSelectedFilter(null);
  }, [championInfo]);

  const onClickFilter = (type: string) => {
    if (selectedFilter === type) {
      setSelectedFilter(null);
      setFilteredChampions(championInfo);
    } else {
      setSelectedFilter(type);
      const filtered = Object.fromEntries(Object.entries(championInfo).filter(([_, info]) => info.line.includes(type)));
      setFilteredChampions(filtered);
    }
  };

  // 검색기능
  const onTextFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm === '') {
      setFilteredChampions(championInfo);
    } else {
      const filtered = Object.fromEntries(
        Object.entries(championInfo).filter(([_, info]) => info.name.toLowerCase().includes(searchTerm)),
      );
      setFilteredChampions(filtered); // 필터링된 챔피언 목록으로 설정
    }
  };

  // Image 클릭시
  const onClick = (pickName: string, info: ChampionInfoI) => {
    if (pickName === '') return;
    setCurrentSelectedPick(pickName, info); // 선택한 챔피언 정보를 저장

    setPickName(pickName);
    setPickObject(info);
  };

  // 챔피언 선택 버튼 클릭시
  const onClickButton = () => {
    let index = banPickObject.find((value) => value.location === currentLocation)?.index as number;

    setBanPickObject(index, pickname, pickObject); // 현재 선택된 챔피언을 세팅해준다
    setChangeChampionInfo(pickname, selectedTeam[selectedTeamIndex].banpick); // 현재 선택된 챔피언의 status 변경
    index++;
    setCurrentLocation(index); // 다음 위치를 저장한다
    setPickName('');
    setPickObject(INITIAL_PICKOBJ);
    clearCurrentSelectedPick(); // 현재 선택 챔피언 초기화
    setSelectedTeamIndex(); // 헤더 변경을 위한 Index값 수정
  };

  return (
    <div className="flex flex-col gap-3 min-w-[508px]">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 mt-2 ml-2">
          <Image
            className="cursor-pointer"
            src="/images/icon-position-top.png"
            alt="top"
            width={20}
            height={20}
            onClick={() => onClickFilter('top')}
          />
          <Image
            className="cursor-pointer"
            src="/images/icon-position-jungle.png"
            alt="jungle"
            width={20}
            height={20}
            onClick={() => onClickFilter('jungle')}
          />
          <Image
            className="cursor-pointer"
            src="/images/icon-position-middle.png"
            alt="middle"
            width={20}
            height={20}
            onClick={() => onClickFilter('mid')}
          />
          <Image
            className="cursor-pointer"
            src="/images/icon-position-bottom.png"
            alt="bottom"
            width={20}
            height={20}
            onClick={() => onClickFilter('ad')}
          />
          <Image
            className="cursor-pointer"
            src="/images/icon-position-utility.png"
            alt="utility"
            width={20}
            height={20}
            onClick={() => onClickFilter('sup')}
          />
        </div>
        <div className="flex items-center border border-subGold w-full max-w-[200px] px-3">
          <FaSearch className="text-mainText text-sm mr-2" />
          <input
            className="text-mainText text-xs w-full py-2 bg-transparent focus:ring-0 focus:border-subGold focus:outline-none placeholder:text-xs placeholder:text-mainText"
            placeholder="검색"
            onChange={onTextFilter}
          />
        </div>
      </div>
      <div
        className="grid grid-cols-7 overflow-auto h-[365px] gap-2"
        style={{ gridTemplateRows: 'repeat(auto-fill, 70px)' }}
      >
        {Object.entries(filteredChampions).map(([name, info], idx) => (
          <div
            className={`relative flex flex-col items-center ${info.status !== '' ? 'cursor-not-allowed' : 'cursor-pointer'} hover:opacity-50 ${info.status != '' || name === pickname ? 'opacity-20' : ''}`}
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
            {info.status !== '' && <FaTimes className="absolute text-6xl text-red-500" />}
            {name === pickname && <FaCheck className="absolute text-6xl text-blue-500" />}
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          onClick={onClickButton}
          className={`${pickname === '' ? 'cursor-not-allowed' : 'cursor-pointer'} h-8 px-8 text-mainText bg-mainGold font-medium text-xs rounded-sm hover:bg-opacity-65`}
          disabled={pickname === ''}
        >
          챔피언 선택
        </button>
      </div>
    </div>
  );
}
