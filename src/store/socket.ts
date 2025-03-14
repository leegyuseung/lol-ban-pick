import { create } from 'zustand';

type SocketState = {
  roomId: string;
  setRoomId: (roomId: string) => void;
};

export const useSocketStore = create<SocketState>((set) => ({
  roomId: '',
  setRoomId: (roomId: string) =>
    set({
      roomId: roomId,
    }),
}));
