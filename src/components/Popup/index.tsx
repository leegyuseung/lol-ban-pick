'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import { usePopupStore } from '@/store';
import { usePathname } from 'next/navigation';

function PopupComp() {
  const { btnList, isOpen, initPopupState, title, content } = usePopupStore();
  const pathName = usePathname();

  // pathName이 변경될 때 initPopupState를 호출하도록 useEffect를 사용
  useLayoutEffect(() => {
    initPopupState();
  }, [pathName, initPopupState]); // pathName이 변경될 때마다 실행


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
            {title ? <h2 className="text-white text-xl font-semibold">{title}</h2> : null}

            {/* 모달 내용 */}
            <div className="flex flex-col items-center w-full gap-5 mt-4">
              <div className="text-gray-300 text-center">{content}</div>

              {/* 버튼 리스트 */}
              <div className="w-full flex gap-4 justify-center">
                {btnList.map((btn) => (
                  <button
                    key={btn.text}
                    onClick={btn.func}
                    className="w-full px-4 py-2 rounded-lg border-2 border-mainGold text-mainGold hover:bg-mainGold hover:text-black transition"
                  >
                    {btn.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default PopupComp;
