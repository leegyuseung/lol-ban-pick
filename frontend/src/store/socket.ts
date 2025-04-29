import { create } from 'zustand';
import { useRulesStore } from '@/store/rules';
import { SocketStateType } from '@/types';
import { Socket } from 'socket.io-client';

export const useSocketStore = create<SocketStateType>((set, get) => ({
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
