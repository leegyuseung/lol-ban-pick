import { create } from 'zustand';

type UserState = {
  userId: string;
  setUserId: (userId: string) => void;
};

export const useUserStore = create<UserState>((set) => ({
  userId: "",
  setUserId: (userId: string) =>
    set({
      userId: userId,
    }),
}));
