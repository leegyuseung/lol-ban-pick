'use client';
import React, { useLayoutEffect } from 'react';
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
          <div className="relative flex flex-col items-center bg-mainBlack rounded-lg min-w-[375px] md:min-w-[500px] p-6 shadow-lg border-2 border-mainGold">
            {/* 닫기 버튼 (X) */}
            {/* <button
              onClick={() => setIsOpen(false)} // 닫기 함수
              className="absolute top-3 right-3 text-mainGold hover:text-white transition"
            >
              ✖
            </button> */}

            {/* 타이틀 */}
            {title ? <h2 className="text-mainText text-xs md:text-2xl font-medium">{title}</h2> : null}

            {/* 모달 내용 */}
            <div className="flex flex-col items-center w-full gap-2 md:gap-5 md:mt-4">
              <div className="text-mainText text-center text-xs md:text-base ">{content}</div>

              {/* 버튼 리스트 */}
              <div className="w-full flex gap-2 md:gap-4 justify-center">
                {btnList.map((btn) => (
                  <button
                    key={btn.text}
                    onClick={btn.func}
                    className="text-xs md:text-base w-full px-4 py-3 rounded-lg border-2 border-mainGold text-mainText md:hover:bg-gray-500 md:hover:text-mainText transition"
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
