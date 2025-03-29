import React, { SyntheticEvent, useEffect, useState } from 'react';
import { FaCopy } from 'react-icons/fa6';
import { FaCheck } from 'react-icons/fa';
import ConfirmPopup from '../Popup/confirm';
function ShareUrl({ url, role }: { url: string; role: string }) {
  const [isCopyed, setIsCopyed] = useState(false);
  const [showConfirmPopup, setIsShowConfirmPopup] = useState(false);
  const copyText = (e: SyntheticEvent) => {
    navigator.clipboard.writeText(url);
    setIsCopyed(true);
    handleShowPopup(true);
  };
  const handleShowPopup = (isShow: boolean) => {
    console.log(isShow, '????');
    setIsShowConfirmPopup(isShow); // 직접 새로운 값 설정
  };
  return (
    <div className="pb-3">
      <div className="w-full text-mainText text-left pb-2">{role} 공유하기</div>
      <div className="flex items-center space-x-2 border p-2 rounded-lg cursor-pointer" onClick={copyText}>
        <i className="w-5 h-5">{isCopyed ? <FaCheck /> : <FaCopy />}</i>
        {url}
      </div>

      <ConfirmPopup
        isOpen={showConfirmPopup}
        setIsOpen={setIsShowConfirmPopup}
        content={'클립보드에 복사되었습니다.'}
      />
    </div>
  );
}

export default ShareUrl;
