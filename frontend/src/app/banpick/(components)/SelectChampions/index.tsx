'use client';
import ImageComp from '@/components/Image';
import Button from '@/components/Button';
import MiniIcon from '@/components/MiniIcon';
import Loading from '@/components/Loading';
import { useBanStore, useRulesStore, usePeerlessStore } from '@/store';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FaSearch, FaTimes, FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { throttle } from 'lodash';
import {
  banPickModeOptions,
  filterOptions,
  InitailizeInfoData,
  lineMappingOptions,
  statusOptions,
  teamSideOptions,
} from '@/constants';
import { BanObjectType, ChampionInfoI } from '@/types';

// search Icon 최적화
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
  const { banpickMode, nowSet, hostInfo, setPeerlessSet, setClearPeerlessSet } = useRulesStore();
  const { setHostBan, setGuestBan, hostBan, guestBan, setClearHostBan, setClearGuestBan } = usePeerlessStore();
  const [filteredChampions, setFilteredChampions] = useState(championInfo); // 검색기능, 라인별 조회 기능
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null); // 라인별 조회 기능용 on/off
  const [bluePeerlessArray, setBluePeerlessArray] = useState<BanObjectType[]>([]); // 피어리스 밴픽 블루팀 배열
  const [redPeerlessArray, setRedPeerlessArray] = useState<BanObjectType[]>([]); // 피어리스 밴픽 레드팀 배열
  const [hoverImg, setHoverImg] = useState('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Garen_0.jpg');
  const [isLoadImg, setIsLoadImg] = useState(false);
  const loadImgCnt = useRef(0);
  const router = useRouter();
  const headerSecondRef = useRef(headerSecond);
  useEffect(() => {
    setChampionInfo();
  }, []);

  useEffect(() => {
    setChangeChampionPeerInfo(hostBan, guestBan);
  }, [hostBan, guestBan]);

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
  const onClick = (pickName: string, info: ChampionInfoI) => {
    if (pickName === '') return;
    setCurrentSelectedPick(pickName, info); // 선택한 챔피언 정보를 저장
  };

  // 챔피언 선택 버튼 클릭시
  const onClickButton = useCallback(() => {
    let index = banPickObject.find((value) => value.location === currentLocation)?.index as number;

    setBanPickObject(index, currentSelectedPick[0].name, currentSelectedPick[0].info, false);
    setChangeChampionInfo(currentSelectedPick[0].name, selectedTeam[selectedTeamIndex].banpick);

    const selectedChampion = {
      name: currentSelectedPick[0].name,
      info: currentSelectedPick[0].info,
      line: lineMappingOptions[selectedTeam[selectedTeamIndex].line] ?? -1,
    };

    if (selectedTeam[selectedTeamIndex].banpick === statusOptions.PICK) {
      if (selectedTeam[selectedTeamIndex].color === teamSideOptions.RED) {
        setRedPeerlessArray((prev) => [...prev, selectedChampion]);
      } else {
        setBluePeerlessArray((prev) => [...prev, selectedChampion]);
      }
    }

    index += 1;
    setCurrentLocation(index);
    setCurrentSelectedPick('', InitailizeInfoData);
    setSelectedTeamIndex();
  }, [banPickObject, currentLocation, currentSelectedPick, selectedTeam, selectedTeamIndex]);

  // 다음 세트 버튼 클릭시
  const onNextSet = () => {
    // 피어리스 밴픽 추가
    if (hostInfo.myTeamSide === teamSideOptions.BLUE) {
      setHostBan(bluePeerlessArray); // 내 밴 추가
      setGuestBan(redPeerlessArray); // 상대 밴 추가
    } else {
      setHostBan(redPeerlessArray); // 내 밴 추가
      setGuestBan(bluePeerlessArray); // 상대 밴 추가
    }
    setPeerlessSet(); // 피어리스 세트 증가

    // 리스트들 초기화를 해줘야한다.
    setClearBanPickObject(); // 밴픽 객체 초기화
    setClearSelectTeamIndex(); // 선택된 팀 인덱스 초기화
    setClearCurrentLocation(); // 현재 위치 초기화
    setRedPeerlessArray([]); // 레드피어리스 초기화
    setBluePeerlessArray([]); // 블루피어리스 초기화
    router.refresh();
  };

  // 다시하기 버튼 클릭시
  const onReplay = useCallback(() => {
    setChampionInfo(); // 챔피언 정보 초기화
    setClearBanPickObject(); // 밴픽 객체 초기화
    setClearSelectTeamIndex(); // 선택된 팀 인덱스 초기화
    setClearCurrentLocation(); // 현재 위치 초기화

    // 피어리스 밴픽 초기화
    if (banpickMode !== banPickModeOptions.TNM) {
      setClearPeerlessSet(); // 피어리스 세트 초기화
      setRedPeerlessArray([]); // 레드피어리스 초기화
      setBluePeerlessArray([]); // 블루피어리스 초기화
      setClearHostBan(); // 내 밴 초기화
      setClearGuestBan(); // 상대 밴 초기화
    }
    router.refresh();
  }, [
    banpickMode,
    setClearBanPickObject,
    setClearSelectTeamIndex,
    setClearCurrentLocation,
    setClearHostBan,
    setClearGuestBan,
  ]);

  const preloadImg = useCallback(
    (name: string) => {
      setHoverImg((_) => `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${name}_0.jpg`);
    },
    [hoverImg],
  );

  const imgLoadF = () => {
    if (!isNaN(loadImgCnt.current)) {
      loadImgCnt.current++;
      if (loadImgCnt.current == Object.entries(filteredChampions).length) {
        setIsLoadImg(true);
      }
    }
  };

  useEffect(() => {
    headerSecondRef.current = headerSecond;
  }, [headerSecond]);

  const throttledClick = useRef(
    throttle((name, info) => {
      if (headerSecondRef.current !== '') {
        onClick(name, info);
      }
    }, 700),
  ).current;

  const handleClick = (name: string, info: any) => {
    throttledClick(name, info);
  };

  return (
    <div className="flex flex-col gap-3 md:w-[508px] md:order-3">
      {/* 이미지 로드 될때 loading 해제 */}
      {!isLoadImg ? (
        <>
          <Loading />
        </>
      ) : (
        <></>
      )}
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
        <div className="hidden md:flex items-center border border-subGold w-full max-w-[200px] px-3">
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
            className={`relative flex flex-col items-center ${info.status !== '' ? 'cursor-not-allowed' : 'cursor-pointer'} md:hover:opacity-50 ${info.status != '' || name === currentSelectedPick[0].name ? 'opacity-20' : ''}`}
            key={name}
          >
            <ImageComp
              onLoad={imgLoadF}
              onError={imgLoadF}
              key={name}
              alt={name}
              className="border border-mainGold"
              width={60}
              height={60}
              onMouseOver={(e) => preloadImg(name)}
              src={`https://ddragon.leagueoflegends.com/cdn/${info.version}/img/champion/${name}.png`}
              onClick={() => handleClick(name, info)}
            />
            <p className="text-[9px] text-center text-mainText truncate">{info.name}</p>
            {info.status !== '' && <FaTimes className="absolute top-1 md:top-0 text-4xl md:text-6xl text-red-500" />}
            {name === currentSelectedPick[0].name && (
              <FaCheck className="absolute md:top-0 top-1 text-4xl md:text-6xl text-blue-500" />
            )}
          </div>
        ))}
      </div>
      {/* 이미지를 미리 캐싱해두어서 픽했을때 버벅 거림을 방지 */}
      <div className="invisible w-0 h-0 absolute">
        <ImageComp className="border border-mainGold" width={60} height={60} src={hoverImg} />
      </div>
      <div className="relative flex justify-center">
        {((banpickMode === banPickModeOptions.PRL3 && nowSet === 3 && headerSecond === '') ||
          (banpickMode === banPickModeOptions.TNM && headerSecond === '') ||
          (banpickMode === banPickModeOptions.PRL5 && nowSet === 5 && headerSecond === '')) && (
          <div className="md:absolute left-0">
            <Button
              text={'뒤로가기'}
              className={`bg-mainGold cursor-pointer h-8 px-8 text-mainText font-medium text-xs rounded-sm md:hover:bg-opacity-65`}
              onClick={() => (window.location.href = '/')}
            />
          </div>
        )}

        {headerSecond !== '' && (
          <div className="md:absolute">
            <Button
              text={'챔피언 선택'}
              className={`${currentSelectedPick[0].name === '' || headerSecond === '' ? 'cursor-not-allowed' : 'cursor-pointer'} h-8 px-8 text-mainText bg-mainGold font-medium text-xs rounded-sm md:hover:bg-opacity-65`}
              onClick={currentSelectedPick[0].name === '' || headerSecond === '' ? undefined : onClickButton}
            />
          </div>
        )}

        {((banpickMode === banPickModeOptions.PRL3 && nowSet === 3 && headerSecond === '') ||
          (banpickMode === banPickModeOptions.PRL5 && nowSet === 5 && headerSecond === '') ||
          (banpickMode === banPickModeOptions.TNM && headerSecond === '')) && (
          <div className="md:absolute right-0">
            <Button
              text={'다시하기'}
              className={`bg-mainGold cursor-pointer h-8 px-8 text-mainText font-medium text-xs rounded-sm md:hover:bg-opacity-65`}
              onClick={onReplay}
            />
          </div>
        )}

        {((banpickMode !== banPickModeOptions.TNM &&
          banpickMode === banPickModeOptions.PRL3 &&
          nowSet < 3 &&
          headerSecond === '') ||
          (banpickMode !== banPickModeOptions.TNM &&
            banpickMode === banPickModeOptions.PRL5 &&
            nowSet < 5 &&
            headerSecond === '')) && (
          <div className="md:absolute right-0">
            <Button
              text={`${nowSet + 1}세트`}
              className={`bg-mainGold cursor-pointer h-8 px-8 text-mainText font-medium text-xs rounded-sm md:hover:bg-opacity-65`}
              onClick={onNextSet}
            />
          </div>
        )}
      </div>
    </div>
  );
}
