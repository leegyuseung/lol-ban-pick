'use client';
import ImageComp from '@/components/Image';
import Button from '@/components/Button';
import MiniIcon from '@/components/MiniIcon';
import { useRulesStore, usePeerlessStore } from '@/store';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FaSearch, FaTimes, FaCheck } from 'react-icons/fa';
import { ChampionInfoI, InfoType } from '@/types/types';
import { BanArray } from '@/store/banpick';
import { useRouter } from 'next/navigation';
import { useBanTeamStore, useBanStore } from '@/store';

const lineMapping: Record<string, number> = {
  top: 0,
  jungle: 1,
  mid: 2,
  ad: 3,
  sup: 4,
};

// search Icon 최적화
const MemoizedFaSearch = memo(FaSearch);

export default function SelectChampions() {
  const {
    championInfo,
    setChampionInfo,
    setChangeChampionPeerInfo,
    selectedTeam,
    setClearSelectTeamIndex,
    setClearCurrentLocation,
    setClearBanPickObject,
    headerSecond,
    currentSelectedPick,
    selectedTeamIndex,
  } = useBanStore();
  const { SelectTeamImage, SelectTeamChampion } = useBanTeamStore();

  const { banpickMode, nowSet, role, hostInfo, guestInfo, setPeerlessSet } = useRulesStore();
  const { setMyBan, setYourBan, myBan, yourBan, setClearMyBan, setClearYourBan } = usePeerlessStore();
  const [filteredChampions, setFilteredChampions] = useState(championInfo); // 검색기능, 라인별 조회 기능
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null); // 라인별 조회 기능용 on/off
  const [bluePeerlessArray, setBluePeerlessArray] = useState<BanArray[]>([]); // 피어리스 밴픽 블루팀 배열
  const [redPeerlessArray, setRedPeerlessArray] = useState<BanArray[]>([]); // 피어리스 밴픽 레드팀 배열
  const filterOptions = ['top', 'jungle', 'mid', 'ad', 'sup'];
  const InfoDataRef = useRef<InfoType>();
  const router = useRouter();

  // InfoData 세팅
  useEffect(() => {
    if (role === 'host') {
      InfoDataRef.current = hostInfo;
    } else if (role === 'guest') {
      InfoDataRef.current = guestInfo;
    } else if (role === 'audience') {
      InfoDataRef.current = {
        myTeam: '',
        yourTeam: '',
        myTeamSide: 'audience',
        yourTeamSide: 'audience',
        myImg: '',
        yourImg: '',
      };
    }
  }, [role, hostInfo, guestInfo]);

  // 챔피언 정보 가져오기
  useEffect(() => {
    setChampionInfo();
  }, []);

  // 피어리스 밴픽에 따른 챔피언 정보 변경
  useEffect(() => {
    setChangeChampionPeerInfo(myBan, yourBan);
  }, [myBan, yourBan]);

  // 챔피언 정보 필터링
  useEffect(() => {
    setFilteredChampions(championInfo); // 챔피언 정보가 변경될 때 필터링 데이터 초기화
    setSelectedFilter(null);
  }, [championInfo]);

  // 라인별 필터링
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
    [championInfo, selectedFilter],
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
      if (selectedTeam[selectedTeamIndex].color !== InfoDataRef.current?.myTeamSide || pickName === '') return;
      SelectTeamImage(pickName, info); // 선택한 챔피언 정보를 저장
    },
    [SelectTeamImage, selectedTeamIndex],
  );

  // 챔피언 선택 버튼 클릭시
  const onClickButton = useCallback(() => {
    if (selectedTeam[selectedTeamIndex].color !== InfoDataRef.current?.myTeamSide) return;
    SelectTeamChampion();
  }, [SelectTeamChampion, selectedTeam, selectedTeamIndex]);

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
            className={`relative flex flex-col items-center ${selectedTeam[selectedTeamIndex].color !== InfoDataRef.current?.myTeamSide || info.status !== '' ? 'cursor-not-allowed' : 'cursor-pointer'} hover:opacity-50 ${info.status != '' || name === currentSelectedPick[0].name ? 'opacity-20' : ''}`}
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
        {((banpickMode === 'peerless3' && nowSet === 3 && headerSecond === '' && role === 'host') ||
          (banpickMode === 'tournament' && headerSecond === '' && role === 'host') ||
          (banpickMode === 'peerless5' && nowSet === 5 && headerSecond === '' && role === 'host')) && (
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
              className={`${selectedTeam[selectedTeamIndex].color !== InfoDataRef.current?.myTeamSide || currentSelectedPick[0].name === '' || headerSecond === '' ? 'cursor-not-allowed' : 'cursor-pointer'} h-8 px-8 text-mainText bg-mainGold font-medium text-xs rounded-sm hover:bg-opacity-65`}
              onClick={currentSelectedPick[0].name === '' || headerSecond === '' ? undefined : onClickButton}
            />
          </div>
        )}

        {((banpickMode === 'peerless3' && nowSet === 3 && headerSecond === '' && role === 'host') ||
          (banpickMode === 'peerless5' && nowSet === 5 && headerSecond === '' && role === 'host') ||
          (banpickMode === 'tournament' && headerSecond === '' && role === 'host')) && (
          <div className="absolute right-0">
            <Button
              text={'다시하기'}
              className={`bg-mainGold cursor-pointer h-8 px-8 text-mainText font-medium text-xs rounded-sm hover:bg-opacity-65`}
              onClick={onReplay}
            />
          </div>
        )}

        {((banpickMode !== 'tournament' &&
          banpickMode === 'peerless3' &&
          nowSet < 3 &&
          headerSecond === '' &&
          role === 'host') ||
          (banpickMode !== 'tournament' &&
            banpickMode === 'peerless5' &&
            nowSet < 5 &&
            headerSecond === '' &&
            role === 'host')) && (
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
