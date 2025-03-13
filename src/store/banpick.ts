import { ChampionInfoI } from '@/types/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Store = {
  championInfo: Record<string, ChampionInfoI>;
  setChampionInfo: () => Promise<void>;
};

type HeaderType = {
  selectedTeam: {
    color: string;
    banpick: string;
  }[];
  selectedTeamIndex: number;
  setSelectedTeamIndex: () => void;
};

export type BanPickObjectType = {
  index: number;
  location: string;
  name: string;
  info: ChampionInfoI;
  use: boolean;
}[];

export type currentSelectedPickType = {
  name: string;
  info: ChampionInfoI;
}[];

interface BanI {
  currentSelectedPick: currentSelectedPickType;

  setCurrentSelectedPick: (name: string, info: ChampionInfoI) => void;
  clearCurrentSelectedPick: () => void;

  banPickObject: BanPickObjectType;
  setBanPickObject: (index: number, name: string, info: ChampionInfoI) => void;

  currentLocation: string;
  setCurrentLocation: (index: number) => void;
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
              .map(([key, value]) => [key, { ...(value as ChampionInfoI), status: '' }]),
          );

          set({ championInfo: updatedChampionInfo });
        } catch (error) {
          console.error('챔피언 가져오는데 에러 발생:', error);
        }
      },
    }),
    { name: 'championInfo' },
  ),
);

// BanPickHeader에서 사용
export const useHeaderStore = create<HeaderType>()((set) => ({
  selectedTeamIndex: 0,
  setSelectedTeamIndex: () =>
    set((state) => ({
      selectedTeamIndex: state.selectedTeamIndex + 1,
    })),

  selectedTeam: [
    { color: 'blue', banpick: 'ban' },
    { color: 'red', banpick: 'ban' },
    { color: 'blue', banpick: 'ban' },
    { color: 'red', banpick: 'ban' },
    { color: 'blue', banpick: 'ban' },
    { color: 'red', banpick: 'ban' },
    // 1번 밴 끝
    { color: 'blue', banpick: 'pick' },
    { color: 'red', banpick: 'pick' },
    { color: 'red', banpick: 'pick' },
    { color: 'blue', banpick: 'pick' },
    { color: 'blue', banpick: 'pick' },
    { color: 'red', banpick: 'pick' },
    // 1번 픽 끝
    { color: 'red', banpick: 'ban' },
    { color: 'blue', banpick: 'ban' },
    { color: 'red', banpick: 'ban' },
    { color: 'blue', banpick: 'ban' },
    { color: 'red', banpick: 'ban' },
    { color: 'blue', banpick: 'pick' },
    { color: 'blue', banpick: 'pick' },
    { color: 'red', banpick: 'ban' },
    // 2번 픽 끝
    { color: '', banpick: '' },
  ],
}));

// BanPickBody에서 사용
export const useBanStore = create<BanI>()((set) => ({
  currentSelectedPick: [],

  clearCurrentSelectedPick: () =>
    set(() => {
      return { currentSelectedPick: [] };
    }),

  setCurrentSelectedPick: (name, info) =>
    set((state) => {
      const updatedPick = [...state.currentSelectedPick];
      updatedPick[0] = { name, info };

      return { currentSelectedPick: updatedPick };
    }),

  currentLocation: 'blueBan1',

  setCurrentLocation: (index: number) =>
    set((state) => {
      const selectedBanPick = state.banPickObject.find((obj) => obj.index === index);
      return selectedBanPick ? { currentLocation: selectedBanPick.location } : {};
    }),

  banPickObject: [
    {
      index: 0,
      location: 'blueBan1',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
    {
      index: 1,
      location: 'redBan1',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
    {
      index: 2,
      location: 'blueBan2',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
    {
      index: 3,
      location: 'redBan2',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
    {
      index: 4,
      location: 'blueBan3',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
    {
      index: 5,
      location: 'redBan3',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
    {
      index: 6,
      location: 'bluePick1',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
    {
      index: 7,
      location: 'redPick1',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
    {
      index: 8,
      location: 'redPick2',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
    {
      index: 9,
      location: 'bluePick2',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
    {
      index: 10,
      location: 'bluePick3',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
    {
      index: 11,
      location: 'redPick3',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
    {
      index: 12,
      location: 'redBan4',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
    {
      index: 13,
      location: 'blueBan4',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
    {
      index: 14,
      location: 'redBan5',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
    {
      index: 15,
      location: 'blueBan5',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
    {
      index: 16,
      location: 'redPick4',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
    {
      index: 17,
      location: 'bluePick4',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
    {
      index: 18,
      location: 'bluePick5',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
    {
      index: 19,
      location: 'redPick5',
      name: '',
      info: {
        blurb: '',
        id: '',
        key: '',
        name: '',
        partype: '',
        tags: [],
        title: '',
        version: '',
        status: '',
      },
      use: false,
    },
  ],

  setBanPickObject: (index, name, info) =>
    set((state) => {
      const updatedBanPickObject = state.banPickObject.map((obj) =>
        obj.index === index ? { ...obj, name, info, use: true } : obj,
      );
      return { banPickObject: updatedBanPickObject };
    }),
}));
