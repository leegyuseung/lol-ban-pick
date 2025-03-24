import { create } from 'zustand';
import { useRulesStore } from './rules';
import { RulesState } from '@/types/types';

type SocketState = {
  roomId: string;
  setRoomId: (roomId: string) => void;
  ws: WebSocket | null;
  setWs: (ws: any) => void;
  emitFunc: <T extends (...args: unknown[]) => unknown>(func: T, side?: string) => void;
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
  emitFunc: <T extends (...args: unknown[]) => unknown>(func: T, params: any): void => {
    const rulesState = useRulesStore.getState(); // rules 상태 가져오기
    console.log(rulesState);
    if (!rulesState) return;
    func(); // 함수 실행
    const state = get();
    console.log(state);
    state.ws?.send(JSON.stringify({ type: 'emit', rule: rulesState, params, roomId: state.roomId }));
    // }
  },
}));
