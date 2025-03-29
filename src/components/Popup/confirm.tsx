'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import { usePopupStore } from '@/store';
import { usePathname } from 'next/navigation';

function ConfirmPopup({
  title = '확인',
  content = '확인되었습니다',
  isOpen = false,
  setIsOpen,
  btn = {
    text: '확인',
    func: () => {
      setIsOpen(false);
    },
  },
}: {
  title?: string;
  content: string;
  isOpen: boolean;
  setIsOpen: (newV: boolean) => void;
  btn?: { text: string; func: () => void };
}) {
  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative flex flex-col items-center bg-mainBlack rounded-lg min-w-[500px] p-6 shadow-lg border-2 border-mainGold">
            {/* 닫기 버튼 (X) */}
            {/* <button
              onClick={() => setIsOpen(false)} // 닫기 함수
              className="absolute top-3 right-3 text-mainGold hover:text-white transition"
            >
              ✖
            </button> */}

            {/* 타이틀 */}
            {/* {title ? <h2 className="text-white text-xl font-semibold">확인+{isOpen + 'isOpen'}</h2> : null} */}

            {/* 모달 내용 */}
            <div className="flex flex-col items-center w-full gap-5 mt-4">
              <div className="text-gray-300 text-center">{content}</div>

              {/* 버튼 리스트 */}
              <div className="w-full flex gap-4 justify-center">
                <button
                  key={btn.text}
                  onClick={btn.func}
                  className="w-full px-4 py-2 rounded-lg border-2 border-mainGold text-mainGold hover:bg-mainGold hover:text-black transition"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default ConfirmPopup;
