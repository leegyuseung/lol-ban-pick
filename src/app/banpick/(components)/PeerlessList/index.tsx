'use client';
import Image from 'next/image';
import { useRulesStore } from '@/store';

export default function PeerlessList() {
  const { banpickMode } = useRulesStore();

  return (
    <div className="flex flex-col flex-[2]">
      <div className="flex flex-col gap-2 pt-5">
        <div className="flex justify-center w-full">
          {banpickMode === 'tournament' ? (
            ''
          ) : (
            <>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 pt-5">
        <div className="flex justify-center w-full">
          {banpickMode === 'tournament' ? (
            ''
          ) : (
            <>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 pt-5">
        <div className="flex justify-center w-full">
          {banpickMode === 'tournament' ? (
            ''
          ) : (
            <>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 pt-5">
        <div className="flex justify-center w-full">
          {banpickMode === 'tournament' ? (
            ''
          ) : (
            <>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
              <div className="border border-mainGold w-[40px] h-[40px]"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
