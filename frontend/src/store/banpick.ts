import championData from '@/data/champions.json';
import useSimplify from '@/hooks/useSimplify';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useRulesStore } from '@/store/rules';
import { useSendSocket } from '@/hooks/useTeamSocket';
import {
  BanObjectType,
  ChampionInfoI,
  PeerlessStoreType,
  ChampionStoreType,
  BanI,
  TeamBanI,
  ChampionInfoType,
} from '@/types';
import {
  InitailizeInfoData,
  InitializeBanPickObject,
  InitializeCurrentSelectedPick,
  InitializeSelectedTeam,
  locationOptions,
  navigations,
  roleOptions,
  statusOptions,
  teamSideOptions,
} from '@/constants';
import socketType  from '@common/constants';

// 챔피언 정보 불러오기
export const useChampionStore = create<ChampionStoreType>()(
  devtools(
    (set) => ({
      championInfo: {} as Record<string, ChampionInfoI>,
      setChampionInfo: async () => {
        try {
          const response = await fetch(navigations.BANPICKNAME);
          const { championInfo } = await response.json();

          const updatedChampionInfo: Record<string, ChampionInfoI> = Object.fromEntries(
            Object.entries(championInfo)
              .filter(([_, value]) => typeof value === 'object' && value !== null) // 객체만 필터링
              .map(([key, value]) => [
                key,
                {
                  ...(value as ChampionInfoI),
                  status: '',
                  line: (championData as Record<string, { line: string[] }>)[key]?.line || [],
                },
              ]),
          );

          set({ championInfo: updatedChampionInfo });
        } catch (error) {
          console.error('챔피언 가져오는데 에러 발생:', error);
        }
      },

      // status Change
      setChangeChampionInfo: async (name: string, banpick: string) =>
        set((state) => {
          const updatedChampionInfo = { ...state.championInfo };

          if (updatedChampionInfo[name]) {
            updatedChampionInfo[name] = {
              ...updatedChampionInfo[name],
              status: banpick,
            };
          }

          return { championInfo: updatedChampionInfo };
        }),
    }),
    { name: 'championInfo' },
  ),
);

// BanPick에서 사용
export const useBanStore = create<BanI>()((set, get) => ({
  championInfo: {} as Record<string, ChampionInfoI>,
  setChampionInfo: async () => {
    try {
      const response = await fetch(navigations.BANPICKNAME);
      const { championInfo } = await response.json();

      const updatedChampionInfo: Record<string, ChampionInfoI> = Object.fromEntries(
        Object.entries(championInfo)
          .filter(([_, value]) => typeof value === 'object' && value !== null) // 객체만 필터링
          .sort(([, infoA], [, infoB]) =>
            (infoA as ChampionInfoI).name.localeCompare((infoB as ChampionInfoI).name, 'ko-KR'),
          )
          .map(([key, value]) => [
            key,
            {
              ...(value as ChampionInfoI),
              status: '',
              line: (championData as Record<string, { line: string[] }>)[key]?.line || [],
            },
          ]),
      );

      set({ championInfo: updatedChampionInfo });
    } catch (error) {
      console.error('챔피언 가져오는데 에러 발생:', error);
    }
  },

  // status Change
  setChangeChampionInfo: (name: string, banpick: string) =>
    set((state) => {
      const updatedChampionInfo = { ...state.championInfo };

      if (updatedChampionInfo[name]) {
        updatedChampionInfo[name] = {
          ...updatedChampionInfo[name],
          status: banpick,
        };
      }

      return { championInfo: updatedChampionInfo };
    }),

  setChangeChampionPeerInfo: (myBan, yourBan) =>
    set((state) => {
      const bannedChampionNames = [
        ...myBan
          .flat()
          .filter((champ) => champ.name)
          .map((champ) => champ.name),
        ...yourBan
          .flat()
          .filter((champ) => champ.name)
          .map((champ) => champ.name),
      ];

      const peerChampionInfo = Object.fromEntries(
        Object.entries(state.championInfo).map(([name, info]) => [
          name,
          bannedChampionNames.includes(name) ? { ...info, status: statusOptions.PEER } : info,
        ]),
      );

      const BanInitialize = Object.fromEntries(
        Object.entries(peerChampionInfo).map(([name, info]) => [
          name,
          info.status === statusOptions.BAN ? { ...info, status: statusOptions.NO } : info,
        ]),
      );

      return { championInfo: BanInitialize };
    }),

  currentSelectedPick: InitializeCurrentSelectedPick,

  setCurrentSelectedPick: (name, info) =>
    set((state) => {
      const updatedPick = [...state.currentSelectedPick];
      updatedPick[0] = { name, info };
      return { currentSelectedPick: updatedPick };
    }),

  currentLocation: locationOptions.BLUEB1,

  setCurrentLocation: (index) =>
    set((state) => {
      const selectedBanPick = state.banPickObject.find((obj) => obj.index === index);
      return selectedBanPick ? { currentLocation: selectedBanPick.location } : {};
    }),

  setClearCurrentLocation: () =>
    set(() => {
      return { currentLocation: locationOptions.BLUEB1 };
    }),

  banPickObject: InitializeBanPickObject,
  setBanPickObject: (index, name, info, ban) =>
    set((state) => {
      const updatedBanPickObject = state.banPickObject.map((obj) =>
        obj.index === index ? { ...obj, name, info, use: true, random: ban } : obj,
      );
      return { banPickObject: updatedBanPickObject };
    }),

  setClearBanPickObject: () =>
    set(() => {
      return { banPickObject: InitializeBanPickObject };
    }),

  selectedTeamIndex: 0,
  setSelectedTeamIndex: () =>
    set((state) => ({
      selectedTeamIndex: state.selectedTeamIndex + 1,
    })),

  setClearSelectTeamIndex: () =>
    set(() => {
      return { selectedTeamIndex: 0 };
    }),

  selectedTeam: InitializeSelectedTeam,

  RandomPick: () => {
    const {
      championInfo,
      banPickObject,
      currentLocation,
      selectedTeam,
      selectedTeamIndex,
      setBanPickObject,
      setChangeChampionInfo,
      setCurrentLocation,
      setSelectedTeamIndex,
      setCurrentSelectedPick,
    } = get();

    let index = banPickObject.find((value) => value.location === currentLocation)?.index as number;

    // pickname과 pickObject를 가져와야한다.
    const availableChampions = Object.entries(championInfo).filter(([_, info]) => info.status === '');
    const randomIndex = Math.floor(Math.random() * availableChampions.length);
    const [randomName, randomInfo] = availableChampions[randomIndex];

    if (selectedTeam[selectedTeamIndex].banpick === statusOptions.BAN) {
      setBanPickObject(index, randomName, randomInfo, true); // 랜덤 챔피언을 선택해준다
    } else {
      setBanPickObject(index, randomName, randomInfo, true); // 랜덤 챔피언을 선택해준다
      setChangeChampionInfo(randomName, selectedTeam[selectedTeamIndex].banpick); // 현재 선택된 챔피언의 status 변경
    }

    index += 1;
    setCurrentLocation(index); // 다음 위치를 저장한다
    setCurrentSelectedPick('', InitailizeInfoData); // 초기화
    setSelectedTeamIndex(); // 헤더 변경을 위한 Index값 수정
  },

  headerSecond: '',
  setHeaderSecond: (second) =>
    set(() => ({
      headerSecond: second,
    })),
}));

export const usePeerlessStore = create<PeerlessStoreType>()(
  persist(
    (set) => ({
      redBan: [],
      blueBan: [],

      setRedBan: (obj) =>
        set((state) => {
          return { redBan: [...state.redBan, obj] };
        }),

      setBlueBan: (obj) =>
        set((state) => {
          return { blueBan: [...state.blueBan, obj] };
        }),

      setRedBanClear: () =>
        set(() => {
          return { redBan: [] };
        }),

      setBlueBanClear: () =>
        set(() => {
          return { blueBan: [] };
        }),

      hostBan: [],
      guestBan: [],

      setHostBan: (array) =>
        set((state) => {
          const updatedHostban = [...state.hostBan, array];

          return { hostBan: updatedHostban };
        }),

      setTeamBan: (blue, red) =>
        set((state) => {
          const { role, hostInfo, guestInfo } = useRulesStore.getState();
          let updatedHostban: BanObjectType[][] = [];
          let updatedGuestban: BanObjectType[][] = [];

          if (role === roleOptions.HOST || role === roleOptions.AUD) {
            if (hostInfo.myTeamSide === teamSideOptions.BLUE) {
              updatedHostban = [...state.hostBan, blue];
              updatedGuestban = [...state.guestBan, red];
            } else if (hostInfo.myTeamSide === teamSideOptions.RED) {
              updatedHostban = [...state.hostBan, red];
              updatedGuestban = [...state.guestBan, blue];
            }
          } else if (role === roleOptions.GUEST) {
            if (guestInfo.myTeamSide === teamSideOptions.BLUE) {
              updatedHostban = [...state.hostBan, red];
              updatedGuestban = [...state.guestBan, blue];
            } else if (guestInfo.myTeamSide === teamSideOptions.RED) {
              updatedHostban = [...state.hostBan, blue];
              updatedGuestban = [...state.guestBan, red];
            }
          }

          return { hostBan: updatedHostban, guestBan: updatedGuestban };
        }),

      setGuestBan: (array) =>
        set((state) => {
          const updatedGuestban = [...state.guestBan, array];

          return { guestBan: updatedGuestban };
        }),

      setClearHostBan: () =>
        set(() => {
          localStorage.removeItem('peerless-store');
          return { hostBan: [] };
        }),

      setClearGuestBan: () =>
        set(() => {
          localStorage.removeItem('peerless-store');
          return { guestBan: [] };
        }),

      setTeamPeerless: () => {
        useSendSocket(socketType.PEERLESS);
      },

      clearTeamPeerless: () => {
        useSendSocket(socketType.CLEARTEAMPEERLESS);
      },

      setTeamChange: () => {
        useSendSocket(socketType.TEAMCHANGE);
      },
    }),
    {
      name: 'peerless-store',
    },
  ),
);

// Team Banpick Store
export const useBanTeamStore = create<TeamBanI>()((set, get) => ({
  // 챔피언을 선택했을 때
  SelectChampionImage: (name: string, info: ChampionInfoType) => {
    useSendSocket(socketType.IMAGE, { name, info });
  },

  // 챔피언을 선택하고 버튼을 클릭했을 때
  SelectTeamChampion: () => {
    useSendSocket(socketType.CHAMPION);
  },

  // Random Pick
  TeamRandomPick: async () => {
    const { championInfo } = useBanStore.getState();
    const availableChampions = Object.entries(championInfo).filter(([_, info]) => info.status === '');
    const randomIndex = Math.floor(Math.random() * availableChampions.length);
    const [randomName, randomInfo] = availableChampions[randomIndex];
    const newRandomInfo = await useSimplify(randomInfo);

    useSendSocket(socketType.RANDOM, { randomName, newRandomInfo });
  },
}));
