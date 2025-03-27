import championData from '../mock/champions.json';
import { ChampionInfoI } from '@/types/types';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useSocketStore } from './socket';
import { useRulesStore } from './rules';

type Store = {
  championInfo: Record<string, ChampionInfoI>;
  setChampionInfo: () => Promise<void>;
  setChangeChampionInfo: (name: string, banPick: string) => void;
};

export type BanArray = {
  name: string;
  info: ChampionInfoI;
  line: number;
};

type PeerlessStore = {
  redBan: BanArray[];
  blueBan: BanArray[];

  setRedBan: (obj: BanArray) => void;
  setBlueBan: (obj: BanArray) => void;

  setRedBanClear: () => void;
  setBlueBanClear: () => void;

  hostBan: BanArray[][];
  guestBan: BanArray[][];
  setHostBan: (array: BanArray[]) => void;
  setTeamBan: (blue: BanArray[], red: BanArray[]) => void;
  setGuestBan: (array: BanArray[]) => void;
  setClearHostBan: () => void;
  setClearGuestBan: () => void;
  setTeamPeerless: () => void;
  clearTeamPeerless: () => void;
};

export type BanPickObjectType = {
  index: number;
  location: string;
  name: string;
  info: ChampionInfoI;
  use: boolean;
  random: boolean;
  status: string;
}[];

export type currentSelectedPickType = {
  name: string;
  info: ChampionInfoI;
}[];

export const InfoData = {
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

const InitializeBanPickObject = [
  {
    index: 0,
    location: 'blueBan1',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'ban',
  },
  {
    index: 1,
    location: 'redBan1',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'ban',
  },
  {
    index: 2,
    location: 'blueBan2',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'ban',
  },
  {
    index: 3,
    location: 'redBan2',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'ban',
  },
  {
    index: 4,
    location: 'blueBan3',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'ban',
  },
  {
    index: 5,
    location: 'redBan3',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'ban',
  },
  {
    index: 6,
    location: 'bluePick1',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'pick',
  },
  {
    index: 7,
    location: 'redPick1',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'pick',
  },
  {
    index: 8,
    location: 'redPick2',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'pick',
  },
  {
    index: 9,
    location: 'bluePick2',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'pick',
  },
  {
    index: 10,
    location: 'bluePick3',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'pick',
  },
  {
    index: 11,
    location: 'redPick3',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'pick',
  },
  {
    index: 12,
    location: 'redBan4',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'ban',
  },
  {
    index: 13,
    location: 'blueBan4',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'ban',
  },
  {
    index: 14,
    location: 'redBan5',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'ban',
  },
  {
    index: 15,
    location: 'blueBan5',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'ban',
  },
  {
    index: 16,
    location: 'redPick4',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'pick',
  },
  {
    index: 17,
    location: 'bluePick4',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'pick',
  },
  {
    index: 18,
    location: 'bluePick5',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'pick',
  },
  {
    index: 19,
    location: 'redPick5',
    name: '',
    info: InfoData,
    use: false,
    random: false,
    status: 'pick',
  },
];

interface BanI {
  championInfo: Record<string, ChampionInfoI>;
  setChampionInfo: () => Promise<void>;
  setChangeChampionInfo: (name: string, banPick: string) => void;
  setChangeChampionPeerInfo: (myBan: BanArray[][], yourBan: BanArray[][]) => void;

  currentSelectedPick: currentSelectedPickType;
  setCurrentSelectedPick: (name: string, info: ChampionInfoI) => void;

  banPickObject: BanPickObjectType;
  setBanPickObject: (index: number, name: string, info: ChampionInfoI, ran: boolean) => void;
  setClearBanPickObject: () => void;

  currentLocation: string;
  setCurrentLocation: (index: number) => void;
  setClearCurrentLocation: () => void;

  selectedTeam: {
    color: string;
    banpick: string;
    line: string;
  }[];
  selectedTeamIndex: number;
  setSelectedTeamIndex: () => void;
  setClearSelectTeamIndex: () => void;

  RandomPick: () => void;

  headerSecond: string;
  setHeaderSecond: (second: string) => void;
}

interface TeamBanI {
  SelectTeamImage: (name: string, info: ChampionInfoI) => void;
  SelectTeamChampion: () => void;
  TeamRandomPick: () => void;
}

// 챔피언 정보 불러오기
export const useBanpickStore = create<Store>()(
  devtools(
    (set) => ({
      championInfo: {} as Record<string, ChampionInfoI>,
      setChampionInfo: async () => {
        try {
          const response = await fetch('/api/banpick/name');
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
      const response = await fetch('/api/banpick/name');
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
          bannedChampionNames.includes(name) ? { ...info, status: 'peer' } : info,
        ]),
      );

      const BanInitialize = Object.fromEntries(
        Object.entries(peerChampionInfo).map(([name, info]) => [
          name,
          info.status === 'ban' ? { ...info, status: '' } : info,
        ]),
      );

      return { championInfo: BanInitialize };
    }),

  currentSelectedPick: [
    {
      name: '',
      info: InfoData,
    },
  ],

  setCurrentSelectedPick: (name, info) =>
    set((state) => {
      const updatedPick = [...state.currentSelectedPick];
      updatedPick[0] = { name, info };
      return { currentSelectedPick: updatedPick };
    }),

  currentLocation: 'blueBan1',

  setCurrentLocation: (index) =>
    set((state) => {
      const selectedBanPick = state.banPickObject.find((obj) => obj.index === index);
      return selectedBanPick ? { currentLocation: selectedBanPick.location } : {};
    }),

  setClearCurrentLocation: () =>
    set(() => {
      return { currentLocation: 'blueBan1' };
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

  selectedTeam: [
    { color: 'blue', banpick: 'ban', line: '' },
    { color: 'red', banpick: 'ban', line: '' },
    { color: 'blue', banpick: 'ban', line: '' },
    { color: 'red', banpick: 'ban', line: '' },
    { color: 'blue', banpick: 'ban', line: '' },
    { color: 'red', banpick: 'ban', line: '' },
    // 1번 밴 끝
    { color: 'blue', banpick: 'pick', line: 'top' },
    { color: 'red', banpick: 'pick', line: 'top' },
    { color: 'red', banpick: 'pick', line: 'jungle' },
    { color: 'blue', banpick: 'pick', line: 'jungle' },
    { color: 'blue', banpick: 'pick', line: 'mid' },
    { color: 'red', banpick: 'pick', line: 'mid' },
    // 1번 픽 끝
    { color: 'red', banpick: 'ban', line: '' },
    { color: 'blue', banpick: 'ban', line: '' },
    { color: 'red', banpick: 'ban', line: '' },
    { color: 'blue', banpick: 'ban', line: '' },
    { color: 'red', banpick: 'pick', line: 'ad' },
    { color: 'blue', banpick: 'pick', line: 'ad' },
    { color: 'blue', banpick: 'pick', line: 'sup' },
    { color: 'red', banpick: 'pick', line: 'sup' },
    // 2번 픽 끝
    { color: '', banpick: '', line: '' },
  ],

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

    if (selectedTeam[selectedTeamIndex].banpick === 'ban') {
      setBanPickObject(index, randomName, randomInfo, true); // 랜덤 챔피언을 선택해준다
    } else {
      setBanPickObject(index, randomName, randomInfo, true); // 랜덤 챔피언을 선택해준다
      setChangeChampionInfo(randomName, selectedTeam[selectedTeamIndex].banpick); // 현재 선택된 챔피언의 status 변경
    }

    index += 1;
    setCurrentLocation(index); // 다음 위치를 저장한다
    setCurrentSelectedPick('', InfoData); // 초기화
    setSelectedTeamIndex(); // 헤더 변경을 위한 Index값 수정
  },

  headerSecond: '',
  setHeaderSecond: (second) =>
    set(() => ({
      headerSecond: second,
    })),
}));

export const usePeerlessStore = create<PeerlessStore>()(
  persist(
    (set) => ({
      redBan: [],
      blueBan: [],

      setRedBan: (obj) =>
        set((state) => {
          console.log('🔥redBan', obj);
          return { redBan: [...state.redBan, obj] };
        }),

      setBlueBan: (obj) =>
        set((state) => {
          console.log('🔥blueBan', obj);
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
          let updatedHostban: BanArray[][] = [];
          let updatedGuestban: BanArray[][] = [];

          console.log('🔥setTeamBan', blue, red, role);
          if (role === 'host') {
            if (hostInfo.myTeamSide === 'blue') {
              updatedHostban = [...state.hostBan, blue];
              updatedGuestban = [...state.guestBan, red];
            } else if (hostInfo.myTeamSide === 'red') {
              updatedHostban = [...state.hostBan, red];
              updatedGuestban = [...state.guestBan, blue];
            }
          } else if (role === 'guest') {
            if (guestInfo.myTeamSide === 'blue') {
              updatedHostban = [...state.hostBan, blue];
              updatedGuestban = [...state.guestBan, red];
            } else if (guestInfo.myTeamSide === 'red') {
              updatedHostban = [...state.hostBan, red];
              updatedGuestban = [...state.guestBan, blue];
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
        const socketState = useSocketStore.getState();

        if (!socketState) return;
        const message = {
          type: 'Peerless',
          roomId: socketState.roomId,
        };

        if (socketState.ws && socketState.ws.readyState === WebSocket.OPEN) {
          socketState.ws?.send(JSON.stringify(message));
        }
      },

      clearTeamPeerless: () => {
        const socketState = useSocketStore.getState();
        if (!socketState) return;
        const message = {
          type: 'clearPeerless',
          roomId: socketState.roomId,
        };

        if (socketState.ws && socketState.ws.readyState === WebSocket.OPEN) {
          socketState.ws?.send(JSON.stringify(message));
        }
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
  SelectTeamImage: (name: string, info: ChampionInfoI) => {
    const socketState = useSocketStore.getState();
    if (!socketState) return;
    const message = {
      type: 'image',
      data: { name, info },
      roomId: socketState.roomId,
    };

    if (socketState.ws && socketState.ws.readyState === WebSocket.OPEN) {
      socketState.ws?.send(JSON.stringify(message));
    }
  },

  // 챔피언을 선택하고 버튼을 클릭했을 때
  SelectTeamChampion: () => {
    const socketState = useSocketStore.getState();
    if (!socketState) return;
    const message = {
      type: 'champion',
      roomId: socketState.roomId,
    };

    if (socketState.ws && socketState.ws.readyState === WebSocket.OPEN) {
      socketState.ws?.send(JSON.stringify(message));
    }
  },

  // Random Pick
  TeamRandomPick: () => {
    const socketState = useSocketStore.getState();
    if (!socketState) return;

    const { championInfo } = useBanStore.getState();
    const availableChampions = Object.entries(championInfo).filter(([_, info]) => info.status === '');
    const randomIndex = Math.floor(Math.random() * availableChampions.length);
    const [randomName, randomInfo] = availableChampions[randomIndex];

    const message = {
      type: 'random',
      data: { randomName, randomInfo },
      roomId: socketState.roomId,
    };

    if (socketState.ws && socketState.ws.readyState === WebSocket.OPEN) {
      socketState.ws?.send(JSON.stringify(message));
    }
  },
}));
