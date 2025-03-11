import Image from 'next/image';

export default function BanPickHeader() {
  return (
    <div className="flex h-20  text-white">
      <div className="flex-[3] flex flex-col justify-center items-center">
        <div className="flex flex-[4] w-full justify-between items-center">
          <Image className="ml-10" src="/images/t1.png" alt="logo" width={80} height={80} />
          <span className="text-2xl mr-10">블루팀</span>
        </div>
        <div className="flex-[1] w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 h-full w-full bg-blue-500 animate-fill-left-half"></div>
        </div>
      </div>
      <div className="flex-[1] flex flex-col justify-center items-center">
        <span className="text-xs">1세트</span>
        <span className="text-3xl">:30</span>
      </div>
      <div className="flex-[3] flex flex-col justify-center items-center">
        <div className="flex flex-[4] w-full items-center justify-between">
          <span className="text-2xl ml-10">레드팀</span>
          <Image className="mr-10" src="/images/t1.png" alt="logo" width={80} height={80} />
        </div>
        <div className="flex-[1] w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-full bg-red-500 animate-fill-right-half"></div>
        </div>
      </div>
    </div>
  );
}
