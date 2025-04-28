import { create } from 'zustand';
import { useRulesStore } from './rules';
import { Socket } from 'socket.io-client';

type SocketState = {
  roomId: string;
  setRoomId: (roomId: string) => void;
  socket: Socket | null;
  setSocket: (socket: any) => void;
  emitFunc: <T extends (...args: unknown[]) => unknown>(func: T, side?: string) => void;
  shareUrl: {
    yourTeamUrl: string;
    audienceTeamUrl: string;
  };
  setShareUrl: (arg: { yourTeamUrl: string; audienceTeamUrl: string }) => void;
};

export const useSocketStore = create<SocketState>((set, get) => ({
  roomId: '',
  setRoomId: (roomId: string) =>
    set({
      roomId: roomId,
    }),

  socket: null,
  setSocket: (socket?: Socket | null) =>
    set({
      socket,
    }),
  emitFunc: <T extends (...args: unknown[]) => unknown>(func: T, params: any): void => {
    const rulesState = useRulesStore.getState(); // rules 상태 가져오기
    if (!rulesState) return;
    func(); // 함수 실행
    const state = get();
    state.socket?.send(JSON.stringify({ type: 'emit', rule: rulesState, params, roomId: state.roomId }));
    // }
  },
  shareUrl: {
    yourTeamUrl: '',
    audienceTeamUrl: '',
  },
  setShareUrl: ({ yourTeamUrl, audienceTeamUrl }: { yourTeamUrl: string; audienceTeamUrl: string }) =>
    set({
      shareUrl: {
        yourTeamUrl,
        audienceTeamUrl,
      },
    }),
}));
