import create from 'zustand';
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
          console.log(championInfo,"response")

          set({ championInfo });
        } catch (error) {
          console.error('이미지 목록을 불러오는 중 오류 발생:', error);
        }
      },
    }),
    { name: 'championInfo' },
  ),
);
