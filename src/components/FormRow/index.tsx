'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useRulesStore } from '@/store/rules';
import { FormsData } from '@/types/types';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useCallback } from 'react';
import { useBanpickStore, useSocketStore } from '@/store';
import useImageLoaded from '@/hooks/useImageLoaded';

import { useSearchParams } from 'next/navigation';
export default function Form() {
  const socketRef = useRef<WebSocket | null>(null);
  const searchParams = useSearchParams();
  const getRoomId = searchParams.get('roomId');
  const { setRules } = useRulesStore();
  const { roomId, setRoomId } = useSocketStore();
  const { register, handleSubmit, watch } = useForm<FormsData>({
    defaultValues: {
      banpickMode: 'tournament',
      peopleMode: 'solo',
      timeUnlimited: 'true',
      teamSide: 'blue',
    },
  });
  const router = useRouter();
  const selectedMode = watch('peopleMode');

  const onSubmit = async (data: FormsData) => {
    setRules(data);
    router.push('/banpick');
  };

  useImageLoaded();

useEffect(() => {
  // WebSocket이 연결되지 않으면 새로 연결 시도
  if (!socketRef.current) {
    const connectWebSocket = async () => {
        const response = await fetch(`/api/socket/io?roomId=${roomId}`); // WebSocket 서버 확인 요청
        if (!response.ok) throw new Error('WebSocket server not ready');

        const ws = new WebSocket(`ws://${process.env.NEXT_PUBLIC_SITE_URL}:3001`); // WebSocket 서버 주소로 변경

        ws.onopen = () => console.log('✅ WebSocket connected');

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('📩 받은 메시지:', data);
          
          // 메시지 타입에 따라 알림을 띄움
          if (data.type === 'private') {
            console.log(`📩 새 메시지: ${data.message}`);  // 다른 창에서 메시지를 받으면 alert
          }
        };

        ws.onerror = (error) => console.error('❌ WebSocket error:', error);
        ws.onclose = () => console.log('❌ WebSocket disconnected');

        socketRef.current = ws;
    };

    connectWebSocket();
  }

  return () => {
    socketRef.current?.close();
    socketRef.current = null;
  };
}, [roomId]);

  const onShare = useCallback(() => {
    console.log(roomId, ':roomId');
    window.open(`/?roomId=${roomId}`, '_blank');
  }, [roomId]);

  const sendMessage = () => {
    if (!socketRef.current) {
      console.warn('❌ WebSocket이 연결되지 않음');
      return;
    }

    socketRef.current.send(
      JSON.stringify({ type: 'private', to: roomId, message: 'test' }), // ✅ `to` 필드 추가
    );
  };

  useEffect(() => {
    // if (!getRoomId) setRoomId(Math.random().toString(36).substr(2, 20));
    if (!getRoomId) setRoomId("test3");
    else {
      setRoomId(getRoomId as string);
    }
  }, [getRoomId]);
  useEffect(()=>{
    console.log(socketRef.current)
  },[socketRef])
  useEffect(() => {
    router.prefetch('/banpick');
  }, [router]);

  return (
    <div className="flex flex-col items-center p-7">
      <button onClick={onShare}>공유하기 {roomId}</button>
      <button onClick={sendMessage}>메세지 보내기</button>
    </div>
  );
}
