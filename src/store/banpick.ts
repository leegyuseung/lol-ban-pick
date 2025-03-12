import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Store = {
  championInfo: { [key: string]: { version: string; name: string } };
  setChampionInfo: () => Promise<void>;
};

type BanSeq = {
  selectedTeam: string[];
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

export const useBanStore = create<BanSeq>()(() => ({
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
