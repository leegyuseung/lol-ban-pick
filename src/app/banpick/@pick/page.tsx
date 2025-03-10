import React from 'react';
interface PropType {
  teamName: 'red' | 'blue';
}
function page({ teamName }: PropType) {
  return <div className='text-white text-xs'>teamName:{teamName}</div>;
}

export default page;
