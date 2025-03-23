import React, { SyntheticEvent } from 'react';
import { FaCopy } from 'react-icons/fa6';
function ShareUrl({ url, role }: { url: string; role: string }) {
  const copyText = (e: SyntheticEvent) => {
    navigator.clipboard.writeText((e.target as HTMLElement).innerText);
  };
  return (
    <div className='pb-3'>
      <div className='w-full text-left pb-2'>{role} 공유하기</div>
      <div className='flex items-center space-x-2 border p-2 rounded-lg'>
        <i className='w-5 h-5'>
          <FaCopy onClick={copyText} />
        </i>
        {url}
      </div>
    </div>
  );
}

export default ShareUrl;
