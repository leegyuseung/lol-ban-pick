import championData from '../mock/champions.json';
import { ChampionInfoI } from '@/types/types';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

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
  myBan: BanArray[][];
  yourBan: BanArray[][];
  setMyBan: (array: BanArray[]) => void;
  setYourBan: (array: BanArray[]) => void;
  setClearMyBan: () => void;
  setClearYourBan: () => void;
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

    if (selectedTeam[selectedTeamIndex].banpick == 'ban') {
      setBanPickObject(index, randomName, randomInfo, true); // 랜덤 챔피언을 선택해준다
    } else {
      setBanPickObject(index, randomName, randomInfo, true); // 랜덤 챔피언을 선택해준다
      setChangeChampionInfo(randomName, selectedTeam[selectedTeamIndex].banpick); // 현재 선택된 챔피언의 status 변경
    }

    index++;
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
      myBan: [],
      yourBan: [],

      setMyBan: (array) =>
        set((state) => {
          const updatedMyban = [...state.myBan, array];

          return { myBan: updatedMyban };
        }),

      setYourBan: (array) =>
        set((state) => {
          const updatedYourban = [...state.yourBan, array];

          return { yourBan: updatedYourban };
        }),

      setClearMyBan: () =>
        set(() => {
          localStorage.removeItem('peerless-store');
          return { myBan: [] };
        }),

      setClearYourBan: () =>
        set(() => {
          localStorage.removeItem('peerless-store');
          return { yourBan: [] };
        }),
    }),
    {
      name: 'peerless-store',
    },
  ),
);
