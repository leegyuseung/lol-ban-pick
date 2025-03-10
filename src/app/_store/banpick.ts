import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Store = {
  championInfo: { [key: string]: { imagePath: string } };
  setChampionInfo: () => Promise<void>;
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
