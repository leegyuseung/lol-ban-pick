import Image from 'next/image';

type PropsType = {
  side: string;
};

export default async function PickChampions({ side }: PropsType) {
  return (
    <div className="flex flex-col flex-[3] m-1">
      <div className="flex flex-col flex-[2]">
        <div
          className={`relative overflow-hidden w-full h-10 flex flex-[1] border border-mainGold ${side == 'left' ? 'justify-end items-end' : 'items-end'}`}
        >
          <Image
            src={'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg'}
            layout="fill"
            objectFit="cover"
            objectPosition="right top"
            className="scale-[150%]"
            alt=""
          />
          <span className="absolute bg-opacity-50 m-2">Top</span>
        </div>
        <div
          className={`flex flex-[1] border border-mainGold ${side == 'left' ? 'justify-end items-end' : 'items-end'}`}
        >
          <span className="m-2">Jungle</span>
        </div>
        <div
          className={`flex flex-[1] border border-mainGold ${side == 'left' ? 'justify-end items-end' : 'items-end'}`}
        >
          <span className="m-2">Mid</span>
        </div>
        <div
          className={`flex flex-[1] border border-mainGold ${side == 'left' ? 'justify-end items-end' : 'items-end'}`}
        >
          <span className="m-2">Ad</span>
        </div>
        <div
          className={`flex flex-[1] border border-mainGold ${side == 'left' ? 'justify-end items-end' : 'items-end'}`}
        >
          <span className="m-2">Sup</span>
        </div>
      </div>
      <div className="flex flex-col flex-[1] gap-2 pt-5">
        <div className="flex gap-2 justify-center w-full">
          <div className="border border-mainGold w-[60px] h-[60px]"></div>
          <div className="border border-mainGold w-[60px] h-[60px]"></div>
          <div className="border border-mainGold w-[60px] h-[60px]"></div>
        </div>
        <div className="flex gap-2 justify-center w-full">
          <div className="border border-mainGold w-[60px] h-[60px]"></div>
          <div className="border border-mainGold w-[60px] h-[60px]"></div>
        </div>
      </div>
    </div>
  );
}
