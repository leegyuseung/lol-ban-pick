'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useRulesStore } from '@/store/rules';
import { FormsData } from '@/types/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import useImageLoaded from '@/hooks/useImageLoaded';
import { useSocketStore } from '@/store';

// TODO : 픽창 Image 불러오기 추가, Icon 선택 팝업 추가 및 저장
export default function Form() {
  const socketRef = useRef<WebSocket | null>(null);
  const searchParams = useSearchParams();
  const getRoomId = searchParams?.get("roomId")
  const randamId = Math.random().toString(36).substr(2, 20)
  const { roomId, setRoomId } = useSocketStore();
  const router = useRouter();
  useImageLoaded();
  const { setRules } = useRulesStore();
  const { register, handleSubmit, watch } = useForm<FormsData>({
    defaultValues: {
      banpickMode: 'tournament',
      peopleMode: 'solo',
      timeUnlimited: 'true',
      teamSide: 'blue',
    },
  });
  const selectedMode = watch('peopleMode');

  const onSubmit = async (data: FormsData) => {
    setRules(data);
    router.push('/banpick');
  };

  // 경로의 페이지를 미리 로드
  useEffect(() => {
    router.prefetch('/banpick');
  }, [router]);
  const [a,setA] = useState("")
  // useEffect(() => {
    
  // }, [roomId]);

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
      JSON.stringify({ type: 'private', from:roomId,to: roomId, message: 'test' }), // ✅ `to` 필드 추가
    );
  };
  useEffect(() => {
    if (!getRoomId) {
      setRoomId(Math.random().toString(36).substr(2, 20));
    } else {
      setRoomId(getRoomId as string);
    }
    // WebSocket이 연결되지 않으면 새로 연결 시도
    if (!socketRef.current) {
      const connectWebSocket = async () => {
        console.log(`${searchParams!.get('roomId')?`/api/socket/io?roomId=${getRoomId}`:`/api/socket/io`}`)
        const response = await fetch(`${searchParams!.get('roomId')?`/api/socket/io?roomId=${getRoomId}`:`/api/socket/io`}`); // WebSocket 서버 확인 요청
        if (!response.ok) throw new Error('WebSocket server not ready');

        const ws = new WebSocket(`ws://${process.env.NEXT_PUBLIC_SITE_URL}:3001${searchParams!.get('roomId')?`?roomId=${searchParams!.get('roomId')}`:``}`); // WebSocket 서버 주소로 변경

        ws.onopen = () => console.log('✅ WebSocket connected');

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('📩 받은 메시지:', data);
          setA(JSON.stringify(data))

          // 메시지 타입에 따라 알림을 띄움
          if (data.type === 'private') {
            setA(`📩 새 메시지: ${data.message}`)
            console.log(`📩 새 메시지: ${data.message}`); // 다른 창에서 메시지를 받으면 alert
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
  }, []);
  useEffect(() => {
    console.log(socketRef.current);
  }, [socketRef]);
  return (
    <div className="flex flex-col items-center p-7">
      <button onClick={onShare}>공유하기 {roomId}</button>
      <button onClick={sendMessage}>메세지 보내기</button>
      <span className="text-4xl font-bold pb-6">밴픽 시뮬레이터</span>
      <form className="grid grid-cols-[1fr_2fr_1fr] h-full justify-between gap-20" onSubmit={handleSubmit(onSubmit)}>
        {/* 블루팀 */}
        <div className="flex flex-col justify-center items-center gap-6">
          <div>
            <Image className="cursor-pointer" src="/images/t1.png" alt="logo" width={200} height={79.06} />
          </div>
          <label className="text-lg font-semibold mb-2">블루팀</label>
          <input
            className="p-3 bg-blue-700 rounded-md border-mainText placeholder-mainText w-full"
            {...register('blueTeam')}
            placeholder="블루팀 이름을 입력해주세요."
          />
        </div>

        <div className="flex flex-col gap-10">
          <div>
            {/* 밴픽 모드 */}
            <label className="text-lg font-semibold mb-2 block">밴픽 모드</label>
            <div className="flex w-full justify-center gap-x-5">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" value="tournament" {...register('banpickMode')} defaultChecked />
                토너먼트 드리프트
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" value="peerless3" {...register('banpickMode')} />
                피어리스(3판)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" value="peerless5" {...register('banpickMode')} />
                피어리스(5판)
              </label>
            </div>
          </div>

          {/* 참여 모드 */}
          <div>
            <label className="text-lg font-semibold mb-2 block">참여 모드</label>
            <div className="flex w-full justify-center gap-x-32">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" value="solo" {...register('peopleMode')} defaultChecked />
                SOLO
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" value="team" {...register('peopleMode')} />
                TEAM
              </label>
            </div>
          </div>

          {/* 시간제한 */}
          {selectedMode === 'solo' && (
            <div>
              <label className="text-lg font-semibold mb-2 block">시간 무제한</label>
              <div className="flex w-full justify-center gap-x-32">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" value="true" {...register('timeUnlimited')} defaultChecked />
                  시간 무제한
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" value="false" {...register('timeUnlimited')} />
                  제한 있음
                </label>
              </div>
            </div>
          )}

          {/* 진영선택 */}
          {selectedMode !== 'solo' && (
            <div>
              <label className="text-lg font-semibold mb-2 block">진영</label>
              <div className="flex w-full justify-center gap-x-32">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" value="blue" {...register('teamSide')} defaultChecked />
                  블루팀
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" value="red" {...register('teamSide')} />
                  레드팀
                </label>
              </div>
            </div>
          )}
          <button
            type="submit"
            className="w-full border border-white text-mainText p-3 rounded-md font-bold hover:bg-gray-500 transition"
          >
            시작하기
          </button>
        </div>

        {/* 레드팀 */}
        <div className="flex flex-col justify-center items-center gap-6">
          <div>
            <Image className="cursor-pointer" src="/images/t1.png" alt="logo" width={200} height={79.06} />
          </div>
          <label className="text-lg font-semibold mb-2">레드팀</label>
          <input
            className="p-3 bg-red-700 rounded-md border-mainText placeholder-mainText w-full"
            {...register('redTeam')}
            placeholder="레드팀 이름을 입력해주세요."
          />
        </div>
      </form>
    </div>
  );
}

