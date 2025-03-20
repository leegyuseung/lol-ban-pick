import { create } from 'zustand';
import { useRulesStore } from './rules';
import { RulesState } from '@/types/types';

type SocketState = {
  roomId: string;
  setRoomId: (roomId: string) => void;
  ws: WebSocket | null;
  setWs: (ws: any) => void;
  closeWs: (ws: any) => void;
  executeFun: <T extends (...args: unknown[]) => unknown>(func: T, side?: string) => void;
};

export const useSocketStore = create<SocketState>((set, get) => ({
  roomId: '',
  setRoomId: (roomId: string) =>
    set({
      roomId: roomId,
    }),

  ws: null,
  setWs: (ws?: WebSocket | null) =>
    set({
      ws,
    }),
  closeWs: (ws?: WebSocket | null) => {
    if(ws)ws?.close();
    set({
      ws: null,
    });
    return {};
  },
  executeFun: <T extends (...args: unknown[]) => unknown>(func: T, side?: string): void => {
    // console.log(side,get().rules.myTeamSide)
    // if (get().rules.myTeamSide === side) {
      func(); // 함수 실행
    // }
  },
}));
