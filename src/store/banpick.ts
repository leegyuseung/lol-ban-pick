import { InfoI } from '@/types/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Store = {
  championInfo: InfoI;
  setChampionInfo: () => Promise<void>;
};

type HeaderType = {
  selectedTeam: string[];
  selectedTeamIndex: number;
  setSelectedTeamIndex: () => void;
};

type BanType = {
  cureentSelectedPick: {
    name: string;
    info: InfoI;
  }[];
  setCureentSelectedPick: (name: string, info: InfoI) => void;
  clearCurrentSelectedPick: () => void;

  banPickObject: {
    index: number;
    location: string;
    name: string;
    info: InfoI;
    use: boolean;
  }[];
  setBanPickObject: (index: number, name: string, info: InfoI) => void;

  currentLocation: string;
  setCurrentLocation: (index: number) => void;
};

export const useBanpickStore = create<Store>()(
  devtools(
    (set) => ({
      championInfo: {},
      setChampionInfo: async () => {
        try {
          const response = await fetch('/api/banpick/name');
          const { championInfo } = await response.json();
          set({ championInfo });
        } catch (error) {
          console.error('챔피언 가져오는데 에러가 발생:', error);
        }
      },
    }),
    { name: 'championInfo' },
  ),
);

export const useHeaderStore = create<HeaderType>()((set) => ({
  selectedTeamIndex: 0,
  setSelectedTeamIndex: () =>
    set((state) => ({
      selectedTeamIndex: state.selectedTeamIndex + 1,
    })),

  selectedTeam: [
    'blue',
    'red',
    'blue',
    'red',
    'blue',
    'red', // 1번 밴 끝
    'blue',
    'red',
    'red',
    'blue',
    'blue',
    'red', // 1번 픽 끝
    'red',
    'blue',
    'red',
    'blue', // 2번 밴 끝
    'red',
    'blue',
    'blue',
    'red', // 2번 픽 끝
    '',
  ],
}));

export const useBanStore = create<BanType>()((set) => ({
  cureentSelectedPick: [],

  clearCurrentSelectedPick: () =>
    set(() => {
      return { cureentSelectedPick: [] };
    }),

  setCureentSelectedPick: (name, info) =>
    set((state) => {
      const updatedPick = [...state.cureentSelectedPick];
      updatedPick[0] = { name, info };

      return { cureentSelectedPick: updatedPick };
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
