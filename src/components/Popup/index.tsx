'use client';
import Image from 'next/image';
import React, { ReactEventHandler, useEffect, useState } from 'react';
import { usePopupStore } from '@/store';
interface PropType {
  func: () => void;
}
function PopupComp() {
  const { btnList, isOpen } = usePopupStore();
  return (
    <>
      {isOpen ? (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="flex flex-col justify-center items-center bg-mainBlack rounded-lg w-[1100px] h-[200px] gap-5">
            <div className="flex gap-10">
              <div className="">popup</div>
              <div className="flex"></div>
              {btnList.map((btn) => (
                <button onClick={btn.func} key={btn.text}>
                  {btn.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default PopupComp;
