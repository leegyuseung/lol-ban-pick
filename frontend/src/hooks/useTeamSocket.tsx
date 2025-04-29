import { useSocketStore } from '@/store';

type DataProps<T> = T;

function useSendSocket<T>(type: string, data?: DataProps<T>) {
  const socketState = useSocketStore.getState();

  if (!socketState) return;

  const message = {
    data: data,
    roomId: socketState.roomId,
  };

  if (socketState.socket && socketState.socket.connected) {
    socketState.socket?.emit(type, message);
  }
}

export { useSendSocket };
