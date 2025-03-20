'use client';
import ImageComp from '@/components/Image';
import Button from '@/components/Button';
import MiniIcon from '@/components/MiniIcon';
import { useBanStore, useRulesStore, usePeerlessStore } from '@/store';
import { memo, useCallback, useEffect, useState } from 'react';
import { FaSearch, FaTimes, FaCheck } from 'react-icons/fa';
import { ChampionInfoI } from '@/types/types';
import { BanArray, InfoData } from '@/store/banpick';
import { useRouter } from 'next/navigation';

const lineMapping: Record<string, number> = {
  top: 0,
  jungle: 1,
  mid: 2,
  ad: 3,
  sup: 4,
};

const MemoizedFaSearch = memo(FaSearch);

export default function SelectChampions() {
  const {
    championInfo,
    setChampionInfo,
    setChangeChampionInfo,
    setChangeChampionPeerInfo,
    selectedTeam,
    selectedTeamIndex,
    setSelectedTeamIndex,
    setClearSelectTeamIndex,
    currentSelectedPick,
    setCurrentSelectedPick,
    currentLocation,
    setCurrentLocation,
    setClearCurrentLocation,
    banPickObject,
    setBanPickObject,
    setClearBanPickObject,
    headerSecond,
  } = useBanStore();
  const { banpickMode, nowSet, hostInfo, setPeerlessSet } = useRulesStore();
  const { setMyBan, setYourBan, myBan, yourBan, setClearMyBan, setClearYourBan } = usePeerlessStore();
  const [filteredChampions, setFilteredChampions] = useState(championInfo);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [bluePeerlessArray, setBluePeerlessArray] = useState<BanArray[]>([]);
  const [redPeerlessArray, setRedPeerlessArray] = useState<BanArray[]>([]);
  const filterOptions = ['top', 'jungle', 'mid', 'ad', 'sup'];

  const router = useRouter();

  useEffect(() => {
    setChampionInfo();
  }, []);

  useEffect(() => {
    setChangeChampionPeerInfo(myBan, yourBan);
  }, [myBan, yourBan]);

  useEffect(() => {
    setFilteredChampions(championInfo); // 챔피언 정보가 변경될 때 필터링 데이터 초기화
    setSelectedFilter(null);
  }, [championInfo]);

  const onClickFilter = useCallback(
    (type: string) => {
      if (selectedFilter === type) {
        setSelectedFilter(null);
        setFilteredChampions(championInfo);
      } else {
        setSelectedFilter(type);
        const filtered = Object.fromEntries(
          Object.entries(championInfo).filter(([_, info]) => info.line.includes(type)),
        );
        setFilteredChampions(filtered);
      }
    },
    [championInfo],
  );

  // 검색기능
  const onTextFilter = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const searchTerm = e.target.value.toLowerCase();

      if (searchTerm === '') {
        setFilteredChampions(championInfo);
      } else {
        const filtered = Object.fromEntries(
          Object.entries(championInfo).filter(([_, info]) => info.name.toLowerCase().includes(searchTerm)),
        );
        setFilteredChampions(filtered); // 필터링된 챔피언 목록으로 설정
      }
    },
    [championInfo],
  );

  // Image 클릭시
  const onClick = useCallback(
    (pickName: string, info: ChampionInfoI) => {
      if (pickName === '') return;
      setCurrentSelectedPick(pickName, info); // 선택한 챔피언 정보를 저장
    },
    [setCurrentSelectedPick],
  );

  // 챔피언 선택 버튼 클릭시
  const onClickButton = useCallback(() => {
    let index = banPickObject.find((value) => value.location === currentLocation)?.index as number;

    setBanPickObject(index, currentSelectedPick[0].name, currentSelectedPick[0].info, false);
    setChangeChampionInfo(currentSelectedPick[0].name, selectedTeam[selectedTeamIndex].banpick);

    const selectedChampion = {
      name: currentSelectedPick[0].name,
      info: currentSelectedPick[0].info,
      line: lineMapping[selectedTeam[selectedTeamIndex].line] ?? -1,
    };

    if (selectedTeam[selectedTeamIndex].banpick === 'pick') {
      if (selectedTeam[selectedTeamIndex].color === 'red') {
        setRedPeerlessArray((prev) => [...prev, selectedChampion]);
      } else {
        setBluePeerlessArray((prev) => [...prev, selectedChampion]);
      }
    }

    index += 1;
    setCurrentLocation(index);
    setCurrentSelectedPick('', InfoData);
    setSelectedTeamIndex();
  }, [banPickObject, currentLocation, currentSelectedPick, selectedTeam, selectedTeamIndex]);

  const onNextSet = () => {
    // 피어리스 밴픽 추가
    if (hostInfo.myTeamSide === 'blue') {
      setMyBan(bluePeerlessArray);
      setYourBan(redPeerlessArray);
    } else {
      setMyBan(redPeerlessArray);
      setYourBan(bluePeerlessArray);
    }
    setPeerlessSet();

    // 리스트들 초기화를 해줘야한다.
    setClearBanPickObject();
    setClearSelectTeamIndex();
    setClearCurrentLocation();
    setRedPeerlessArray([]);
    setBluePeerlessArray([]);
    router.refresh();
  };

  const onReplay = useCallback(() => {
    setClearBanPickObject();
    setClearSelectTeamIndex();
    setClearCurrentLocation();
    if (banpickMode !== 'tournament') {
      setRedPeerlessArray([]);
      setBluePeerlessArray([]);
      setClearMyBan();
      setClearYourBan();
    }
    location.reload();
  }, [
    banpickMode,
    setClearBanPickObject,
    setClearSelectTeamIndex,
    setClearCurrentLocation,
    setClearMyBan,
    setClearYourBan,
  ]);

  return (
    <div className="flex flex-col gap-3 w-[508px]">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 mt-2 ml-2">
          {filterOptions.map((type) => (
            <MiniIcon
              key={type}
              className="cursor-pointer"
              src={`/images/icon-position-${type}.png`}
              alt={type}
              width={20}
              height={20}
              onClick={() => onClickFilter(type)}
            />
          ))}
        </div>
        <div className="flex items-center border border-subGold w-full max-w-[200px] px-3">
          <MemoizedFaSearch className="text-mainText text-sm mr-2" />
          <input
            className="text-mainText text-xs w-full py-2 bg-transparent focus:ring-0 focus:border-subGold focus:outline-none placeholder:text-xs placeholder:text-mainText"
            placeholder="검색"
            onChange={onTextFilter}
          />
        </div>
      </div>
      <div
        className="grid grid-cols-7 overflow-auto h-[500px] gap-2"
        style={{ gridTemplateRows: 'repeat(auto-fill, 70px)' }}
      >
        {Object.entries(filteredChampions).map(([name, info], idx) => (
          <div
            className={`relative flex flex-col items-center ${info.status !== '' ? 'cursor-not-allowed' : 'cursor-pointer'} hover:opacity-50 ${info.status != '' || name === currentSelectedPick[0].name ? 'opacity-20' : ''}`}
            key={idx}
          >
            <ImageComp
              alt={name}
              className="border border-mainGold"
              width={60}
              height={60}
              src={`https://ddragon.leagueoflegends.com/cdn/${info.version}/img/champion/${name}.png`}
              onClick={headerSecond !== '' ? () => onClick(name, info) : undefined}
            />
            <p className="text-[9px] text-center text-mainText truncate">{info.name}</p>
            {info.status !== '' && <FaTimes className="absolute text-6xl text-red-500" />}
            {name === currentSelectedPick[0].name && <FaCheck className="absolute text-6xl text-blue-500" />}
          </div>
        ))}
      </div>
      <div className="relative flex justify-center">
        {((banpickMode === 'peerless3' && nowSet === 3 && headerSecond === '') ||
          (banpickMode === 'tournament' && headerSecond === '') ||
          (banpickMode === 'peerless5' && nowSet === 5 && headerSecond === '')) && (
          <div className="absolute left-0">
            <Button
              text={'뒤로가기'}
              className={`bg-mainGold cursor-pointer h-8 px-8 text-mainText font-medium text-xs rounded-sm hover:bg-opacity-65`}
              onClick={() => (window.location.href = '/')}
            />
          </div>
        )}

        {headerSecond !== '' && (
          <div className="absolute">
            <Button
              text={'챔피언 선택'}
              className={`${currentSelectedPick[0].name === '' || headerSecond === '' ? 'cursor-not-allowed' : 'cursor-pointer'} h-8 px-8 text-mainText bg-mainGold font-medium text-xs rounded-sm hover:bg-opacity-65`}
              onClick={currentSelectedPick[0].name === '' || headerSecond === '' ? undefined : onClickButton}
            />
          </div>
        )}

        {((banpickMode === 'peerless3' && nowSet === 3 && headerSecond === '') ||
          (banpickMode === 'peerless5' && nowSet === 5 && headerSecond === '') ||
          (banpickMode === 'tournament' && headerSecond === '')) && (
          <div className="absolute right-0">
            <Button
              text={'다시하기'}
              className={`bg-mainGold cursor-pointer h-8 px-8 text-mainText font-medium text-xs rounded-sm hover:bg-opacity-65`}
              onClick={onReplay}
            />
          </div>
        )}

        {((banpickMode !== 'tournament' && banpickMode === 'peerless3' && nowSet < 3 && headerSecond === '') ||
          (banpickMode !== 'tournament' && banpickMode === 'peerless5' && nowSet < 5 && headerSecond === '')) && (
          <div className="absolute right-0">
            <Button
              text={`${nowSet + 1}세트`}
              className={`bg-mainGold cursor-pointer h-8 px-8 text-mainText font-medium text-xs rounded-sm hover:bg-opacity-65`}
              onClick={onNextSet}
            />
          </div>
        )}
      </div>
    </div>
  );
}
