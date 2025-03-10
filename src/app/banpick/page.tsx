import React from 'react';
import SelectChampions from './selectChampions/page';
import Pick from './@pick/page';

function page() {
  return (
    <div className="flex justify-center">
      <Pick teamName={'red'} />
      <div className="w-3/5 h-[70vh]  items-center bg-black border-l-pink-500  overflow-y-auto">
        <SelectChampions />
      </div>
      <Pick teamName={'blue'} />
    </div>
  );
}

export default page;
