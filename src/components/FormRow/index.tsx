'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useRulesStore } from '@/store/rules';
import { FormsData } from '@/types/types';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';
import { useBanpickStore } from '@/store';
export default function Form() {
  const { championInfo, setChampionInfo } = useBanpickStore();
  useLayoutEffect(() => {
    const hoverImgPreload = (src: string) => {
      const img = new window.Image();
      img.src = src;
    };
    if (!Object.keys(championInfo).length) {
      setChampionInfo();
    } else {
      Object.entries(championInfo).map(([name, info]) =>
        hoverImgPreload(`https://ddragon.leagueoflegends.com/cdn/${info.version}/img/champion/${name}.png`),
      );
    }
  }, [championInfo]);
  const { setRules } = useRulesStore();
  const { register, handleSubmit, watch } = useForm<FormsData>({
    defaultValues: {
      banpickMode: 'tournament',
      peopleMode: 'solo',
      timeUnlimited: true,
      teamSide: 'blue',
    },
  });
  const router = useRouter();
  const selectedMode = watch('peopleMode');
  const onSubmit = async (data: FormsData) => {
    setRules(data);
    router.push('/banpick');
  };

  useEffect(() => {
    router.prefetch('/banpick'); // /next-page 경로의 페이지를 미리 로드
  }, [router]);

  return (
    <div className="flex flex-col items-center p-7 h-auto">
      <span className="text-4xl font-bold pb-6">밴픽 시뮬레이터</span>
      <form className="grid grid-cols-[1fr_2fr_1fr] h-full justify-between gap-20" onSubmit={handleSubmit(onSubmit)}>
        {/* 블루팀 */}
        <div className="flex flex-col justify-center items-center gap-6">
          <Image className="cursor-pointer" src="/images/t1.png" alt="logo" width={200} height={200} />
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
          <Image className="cursor-pointer" src="/images/t1.png" alt="logo" width={200} height={200} />
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
