import React, { SyntheticEvent } from 'react';
import { FaCopy } from 'react-icons/fa6';
import { FaCheck } from 'react-icons/fa';

function ShareUrl({
  url,
  role,
  copyText,
  isCopyed = false,
}: {
  url: string;
  role: string;
  copyText: (e: SyntheticEvent, url: string) => void;
  isCopyed: boolean;
}) {
  return (
    <div className="pb-3">
      <div className="w-full text-mainText text-left pb-2">{role} 공유하기</div>
      <div
        className="flex items-center space-x-2 border border-mainGold p-2 rounded-lg cursor-pointer"
        onClick={(e: SyntheticEvent) => copyText(e, url)}
      >
        <i className="w-5 h-5">{isCopyed ? <FaCheck /> : <FaCopy />}</i>
        {url}
      </div>
    </div>
  );
}

export default ShareUrl;
