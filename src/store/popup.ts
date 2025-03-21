import { create } from 'zustand';

type PopupState = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;

  btnList: { func: () => void; text: string }[];
  setBtnList: (btnList: { func: () => void; text: string }[]) => void;
};

export const usePopupStore = create<PopupState>((set, get) => ({
  isOpen: false,
  setIsOpen: (isOpen) =>
    set({
      isOpen,
    }),
  btnList: [],
  setBtnList: (btnList: { func: () => void; text: string }[]) =>
    set({
      btnList: [...btnList],
    }),
}));
