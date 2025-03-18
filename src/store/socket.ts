import { create } from 'zustand';
import { useRulesStore } from './rules';
import { RulesState } from '@/types/types';

type SocketState = {
  roomId: string;
  setRoomId: (roomId: string) => void;
  host: boolean;
  setHost: (host: boolean) => void;
  ws: WebSocket | null;
  setWs: (ws: any) => void;
  closeWs: (ws: any) => void;
  rules: Omit<RulesState, 'setRules' | 'setPeerlessSet' | 'setClearPeerlessSet'>;
  setRules: (rule: Omit<RulesState, 'setRules' | 'setPeerlessSet' | 'setClearPeerlessSet'>) => void;
  executeFun: <T extends (...args: unknown[]) => unknown>(func: T, side?: string) => void;
};

export const useSocketStore = create<SocketState>((set, get) => ({
  roomId: '',
  setRoomId: (roomId: string) =>
    set({
      roomId: roomId,
    }),

  host: false,
  setHost: (host: boolean) =>
    set({
      host,
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
  rules: {
    myTeam: '',
    yourTeam: '',
    banpickMode: 'tournament',
    peopleMode: 'solo',
    timeUnlimited: 'true',
    myTeamSide: 'blue',
    myImg: '',
    yourImg: '',
    nowSet: 1,
  },
  setRules: (rules: Omit<RulesState, 'setRules' | 'setPeerlessSet' | 'setClearPeerlessSet'>) =>
    set({
      rules,
    }),
  executeFun: <T extends (...args: unknown[]) => unknown>(func: T, side?: string): void => {
    if (get().rules.myTeamSide === side) {
      func(); // 함수 실행
    }
  },
}));
