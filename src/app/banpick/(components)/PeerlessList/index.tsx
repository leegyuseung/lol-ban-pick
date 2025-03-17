'use client';
import Image from 'next/image';
import { usePeerlessStore, useRulesStore } from '@/store';

type PropsType = {
  side: string;
};

export default function PeerlessList({ side }: PropsType) {
  const { banpickMode } = useRulesStore();
  const { myBan, yourBan } = usePeerlessStore();
  const { myTeamSide } = useRulesStore();

  return (
    <div className="flex flex-col flex-[2]">
      {banpickMode !== 'tournament' &&
        myTeamSide === 'blue' &&
        side === 'left' &&
        myBan.map((ban, index) => (
          <div className="flex flex-col gap-2 pt-5" key={index}>
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
        ))}

      {banpickMode !== 'tournament' &&
        myTeamSide === 'red' &&
        side === 'left' &&
        yourBan.map((ban, index) => (
          <div className="flex flex-col gap-2 pt-5" key={index}>
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
        ))}

      {banpickMode !== 'tournament' &&
        myTeamSide === 'blue' &&
        side === 'right' &&
        yourBan.map((ban, index) => (
          <div className="flex flex-col gap-2 pt-5" key={index}>
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
        ))}

      {banpickMode !== 'tournament' &&
        myTeamSide === 'red' &&
        side === 'right' &&
        myBan.map((ban, index) => (
          <div className="flex flex-col gap-2 pt-5" key={index}>
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
        ))}
    </div>
  );
}
