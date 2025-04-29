import { Socket } from 'socket.io-client';

interface ApiResponseI<T> {
  result_code: number;
  result: T;
  message: string;
}

type SocketStateType = {
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

export type { ApiResponseI, SocketStateType };
