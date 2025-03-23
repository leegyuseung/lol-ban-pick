import React from 'react';
import { BanArray } from '@/store/banpick';
import Image from 'next/image';

interface PeerlessImageProps {
  ban: BanArray[];
}

const PeerlessImage = ({ ban }: PeerlessImageProps) => {
  return (
    <div className="flex flex-col gap-2 pt-5">
      <div className="flex justify-center w-full">
        {ban.map((obj, index) => (
          <div className="relative border border-mainGold w-[40px] h-[40px]" key={index}>
            <Image
              src={`https://ddragon.leagueoflegends.com/cdn/${obj.info.version}/img/champion/${obj.name}.png`}
              fill
              sizes="h-10"
              style={{ objectFit: 'cover', objectPosition: 'top' }}
              className="scale-[100%]"
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeerlessImage;
