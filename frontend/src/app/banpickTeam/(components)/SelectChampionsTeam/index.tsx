'use client';
import ImageComp from '@/components/Image';
import Button from '@/components/Button';
import MiniIcon from '@/components/MiniIcon';
import TeamChangePopup from '@/components/TeamChangePopup';
import useSimplify from '@/hooks/useSimplify';
import { useRulesStore, usePeerlessStore } from '@/store';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FaSearch, FaTimes, FaCheck } from 'react-icons/fa';
import { useBanTeamStore, useBanStore } from '@/store';
import { banPickModeOptions, filterOptions, roleOptions, teamSideOptions } from '@/constants';
import { ChampionInfoI, InfoType } from '@/types';

// search Icon 최적화
const MemoizedFaSearch = memo(FaSearch);

export default function SelectChampions() {
  const {
    championInfo,
    setChampionInfo,
    setChangeChampionPeerInfo,
    selectedTeam,
    headerSecond,
    currentSelectedPick,
    selectedTeamIndex,
  } = useBanStore();
  const { SelectChampionImage, SelectTeamChampion } = useBanTeamStore();
  const { banpickMode, nowSet, role, hostInfo, guestInfo } = useRulesStore();
  const { hostBan, guestBan, setTeamPeerless, clearTeamPeerless, setTeamChange } = usePeerlessStore();
  const [filteredChampions, setFilteredChampions] = useState(championInfo); // 검색기능, 라인별 조회 기능
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null); // 라인별 조회 기능용 on/off
  const [showPopup, setShowPopup] = useState(false); // 팀 변경 팝업 상태
  const [resolveFn, setResolveFn] = useState<((value: boolean) => void) | null>(null); // 팀 변경 팝업 확인 함수
  const InfoDataRef = useRef<InfoType>();

  // InfoData 세팅
  useEffect(() => {
    if (role === roleOptions.HOST) {
      InfoDataRef.current = hostInfo;
    } else if (role === roleOptions.GUEST) {
      InfoDataRef.current = guestInfo;
    } else if (role === roleOptions.AUD) {
      InfoDataRef.current = {
        myTeam: '',
        yourTeam: '',
        myTeamSide: teamSideOptions.AUD,
        yourTeamSide: teamSideOptions.AUD,
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
    setChangeChampionPeerInfo(hostBan, guestBan);
  }, [hostBan, guestBan]);

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
  const onClickImage = useCallback(
    async (pickName: string, info: ChampionInfoI) => {
      if (selectedTeam[selectedTeamIndex].color !== InfoDataRef.current?.myTeamSide || pickName === '') return;
      const newInfoData = await useSimplify(info);
      SelectChampionImage(pickName, newInfoData); // 선택한 챔피언 정보를 저장
    },
    [SelectChampionImage, selectedTeamIndex],
  );

  // 챔피언 선택 버튼 클릭시
  const onClickButton = useCallback(() => {
    if (selectedTeam[selectedTeamIndex].color !== InfoDataRef.current?.myTeamSide) return;
    SelectTeamChampion();
  }, [SelectTeamChampion, selectedTeam, selectedTeamIndex]);

  // 다음 세트 버튼 클릭시
  const onNextSet = async () => {
    // 피어리스 밴픽 추가
    setTeamPeerless();

    // 팀 변경 메시지 팝업
    const isConfirmed = await openConfirm();
    if (isConfirmed) {
      // 여기에서 팀변경을 해줘야한다
      setTeamChange();
    }

    // 리스트들 초기화를 해줘야한다.
    clearTeamPeerless();
  };

  const openConfirm = () => {
    setShowPopup(true);

    // Promise를 반환하여 "예" 또는 "아니오"가 클릭될 때까지 대기
    return new Promise<boolean>((resolve) => {
      setResolveFn(() => resolve);
    });
  };

  const handleConfirm = () => {
    if (resolveFn) resolveFn(true); // "예" 선택 시 true 반환
    setShowPopup(false);
  };

  const handleCancel = () => {
    if (resolveFn) resolveFn(false); // "아니오" 선택 시 false 반환
    setShowPopup(false);
  };

  return (
    <div className="flex flex-col gap-3 md:w-[508px] md:order-3">
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
            className={`relative flex flex-col items-center ${selectedTeam[selectedTeamIndex].color !== InfoDataRef.current?.myTeamSide || info.status !== '' ? 'cursor-not-allowed' : 'cursor-pointer'} hover:opacity-50 ${info.status != '' || name === currentSelectedPick[0].name ? 'opacity-20' : ''}`}
            key={idx}
          >
            <ImageComp
              alt={name}
              className="border border-mainGold"
              width={60}
              height={60}
              src={`https://ddragon.leagueoflegends.com/cdn/${info.version}/img/champion/${name}.png`}
              onClick={headerSecond !== '' ? () => onClickImage(name, info) : undefined}
            />
            <p className="text-[9px] text-center text-mainText truncate">{info.name}</p>
            {info.status !== '' && <FaTimes className="absolute text-5xl md:text-6xl text-red-500" />}
            {name === currentSelectedPick[0].name && (
              <FaCheck className="absolute text-5xl md:text-6xl text-blue-500" />
            )}
          </div>
        ))}
      </div>
      <div className="md:relative flex justify-center">
        {((banpickMode === banPickModeOptions.PRL3 &&
          nowSet === 3 &&
          headerSecond === '' &&
          role === roleOptions.HOST) ||
          (banpickMode === banPickModeOptions.TNM && headerSecond === '' && role === roleOptions.HOST) ||
          (banpickMode === banPickModeOptions.PRL5 &&
            nowSet === 5 &&
            headerSecond === '' &&
            role === roleOptions.HOST)) && (
          <div className="md:absolute left-0">
            <Button
              text={'뒤로가기'}
              className={`bg-mainGold cursor-pointer h-8 px-8 text-mainText font-medium text-xs rounded-sm hover:bg-opacity-65`}
              onClick={() => (window.location.href = '/')}
            />
          </div>
        )}

        {headerSecond !== '' && (
          <div className="md:absolute">
            <Button
              text={'챔피언 선택'}
              className={`${selectedTeam[selectedTeamIndex].color !== InfoDataRef.current?.myTeamSide || currentSelectedPick[0].name === '' || headerSecond === '' ? 'cursor-not-allowed' : 'cursor-pointer'} h-8 px-8 text-mainText bg-mainGold font-medium text-xs rounded-sm hover:bg-opacity-65`}
              onClick={currentSelectedPick[0].name === '' || headerSecond === '' ? undefined : onClickButton}
            />
          </div>
        )}

        {((banpickMode !== banPickModeOptions.TNM &&
          banpickMode === banPickModeOptions.PRL3 &&
          nowSet < 3 &&
          headerSecond === '' &&
          role === roleOptions.HOST) ||
          (banpickMode !== banPickModeOptions.TNM &&
            banpickMode === banPickModeOptions.PRL5 &&
            nowSet < 5 &&
            headerSecond === '' &&
            role === roleOptions.HOST)) && (
          <div className="md:absolute right-0">
            <Button
              text={`${nowSet + 1}세트`}
              className={`bg-mainGold cursor-pointer h-8 px-8 text-mainText font-medium text-xs rounded-sm hover:bg-opacity-65`}
              onClick={onNextSet}
            />
          </div>
        )}

        {showPopup && <TeamChangePopup onConfirm={handleConfirm} onCancel={handleCancel} />}
      </div>
    </div>
  );
}
