'use client';
import Image from 'next/image';
import { useBanStore } from '@/store';
type PropsType = {
  side: string;
};

export default function PickChampions({ side }: PropsType) {
  const { cureentSelectedPick, banPickObject, currentLocation } = useBanStore();
  return (
    <div className="flex flex-col flex-[3] m-1">
      <div className="flex flex-col flex-[2]">
        <div
          className={`relative overflow-hidden w-full h-10 flex flex-[1] border border-mainGold ${side === 'left' ? 'justify-end items-end' : 'items-end'}`}
        >
          {(banPickObject[6].use ||
            (currentLocation === banPickObject[6].location && cureentSelectedPick.length > 0)) &&
            side === 'left' && (
              <Image
                src={
                  banPickObject[6].use
                    ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${banPickObject[6]?.name}_0.jpg`
                    : currentLocation === banPickObject[6].location
                      ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${cureentSelectedPick[0]?.name}_0.jpg`
                      : ``
                }
                layout="fill"
                objectFit="cover"
                objectPosition="top"
                className="scale-[100%]"
                alt=""
              />
            )}

          {(banPickObject[7].use ||
            (currentLocation === banPickObject[7].location && cureentSelectedPick.length > 0)) &&
            side === 'right' && (
              <Image
                src={
                  banPickObject[7].use
                    ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${banPickObject[7]?.name}_0.jpg`
                    : currentLocation === banPickObject[7].location
                      ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${cureentSelectedPick[0]?.name}_0.jpg`
                      : ''
                }
                layout="fill"
                objectFit="cover"
                objectPosition="top"
                className="scale-[100%]"
                alt=""
              />
            )}
          <span className="absolute bg-opacity-50 m-2">Top</span>
        </div>
        <div
          className={`relative overflow-hidden w-full h-10 flex flex-[1] border border-mainGold ${side === 'left' ? 'justify-end items-end' : 'items-end'}`}
        >
          {(banPickObject[9].use ||
            (currentLocation === banPickObject[9].location && cureentSelectedPick.length > 0)) &&
            side === 'left' && (
              <Image
                src={
                  banPickObject[9].use
                    ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${banPickObject[9]?.name}_0.jpg`
                    : currentLocation === banPickObject[9].location
                      ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${cureentSelectedPick[0]?.name}_0.jpg`
                      : ``
                }
                layout="fill"
                objectFit="cover"
                objectPosition="top"
                className="scale-[100%]"
                alt=""
              />
            )}

          {(banPickObject[8].use ||
            (currentLocation === banPickObject[8].location && cureentSelectedPick.length > 0)) &&
            side === 'right' && (
              <Image
                src={
                  banPickObject[8].use
                    ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${banPickObject[8]?.name}_0.jpg`
                    : currentLocation === banPickObject[8].location
                      ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${cureentSelectedPick[0]?.name}_0.jpg`
                      : ''
                }
                layout="fill"
                objectFit="cover"
                objectPosition="top"
                className="scale-[100%]"
                alt=""
              />
            )}
          <span className="absolute bg-opacity-50 m-2">Jungle</span>
        </div>
        <div
          className={`relative overflow-hidden w-full h-10 flex flex-[1] border border-mainGold ${side === 'left' ? 'justify-end items-end' : 'items-end'}`}
        >
          {(banPickObject[10].use ||
            (currentLocation === banPickObject[10].location && cureentSelectedPick.length > 0)) &&
            side === 'left' && (
              <Image
                src={
                  banPickObject[10].use
                    ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${banPickObject[10]?.name}_0.jpg`
                    : currentLocation === banPickObject[10].location
                      ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${cureentSelectedPick[0]?.name}_0.jpg`
                      : ``
                }
                layout="fill"
                objectFit="cover"
                objectPosition="top"
                className="scale-[100%]"
                alt=""
              />
            )}

          {(banPickObject[11].use ||
            (currentLocation === banPickObject[11].location && cureentSelectedPick.length > 0)) &&
            side === 'right' && (
              <Image
                src={
                  banPickObject[11].use
                    ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${banPickObject[11]?.name}_0.jpg`
                    : currentLocation === banPickObject[11].location
                      ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${cureentSelectedPick[0]?.name}_0.jpg`
                      : ''
                }
                layout="fill"
                objectFit="cover"
                objectPosition="top"
                className="scale-[100%]"
                alt=""
              />
            )}
          <span className="absolute bg-opacity-50 m-2">Mid</span>
        </div>
        <div
          className={`relative overflow-hidden w-full h-10 flex flex-[1] border border-mainGold ${side === 'left' ? 'justify-end items-end' : 'items-end'}`}
        >
          {(banPickObject[17].use ||
            (currentLocation === banPickObject[17].location && cureentSelectedPick.length > 0)) &&
            side === 'left' && (
              <Image
                src={
                  banPickObject[17].use
                    ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${banPickObject[17]?.name}_0.jpg`
                    : currentLocation === banPickObject[17].location
                      ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${cureentSelectedPick[0]?.name}_0.jpg`
                      : ``
                }
                layout="fill"
                objectFit="cover"
                objectPosition="top"
                className="scale-[100%]"
                alt=""
              />
            )}

          {(banPickObject[16].use ||
            (currentLocation === banPickObject[16].location && cureentSelectedPick.length > 0)) &&
            side === 'right' && (
              <Image
                src={
                  banPickObject[16].use
                    ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${banPickObject[16]?.name}_0.jpg`
                    : currentLocation === banPickObject[16].location
                      ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${cureentSelectedPick[0]?.name}_0.jpg`
                      : ''
                }
                layout="fill"
                objectFit="cover"
                objectPosition="top"
                className="scale-[100%]"
                alt=""
              />
            )}
          <span className="absolute bg-opacity-50 m-2">Ad</span>
        </div>
        <div
          className={`relative overflow-hidden w-full h-10 flex flex-[1] border border-mainGold ${side === 'left' ? 'justify-end items-end' : 'items-end'}`}
        >
          {(banPickObject[18].use ||
            (currentLocation === banPickObject[18].location && cureentSelectedPick.length > 0)) &&
            side === 'left' && (
              <Image
                src={
                  banPickObject[18].use
                    ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${banPickObject[18]?.name}_0.jpg`
                    : currentLocation === banPickObject[18].location
                      ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${cureentSelectedPick[0]?.name}_0.jpg`
                      : ``
                }
                layout="fill"
                objectFit="cover"
                objectPosition="top"
                className="scale-[100%]"
                alt=""
              />
            )}

          {(banPickObject[19].use ||
            (currentLocation === banPickObject[19].location && cureentSelectedPick.length > 0)) &&
            side === 'right' && (
              <Image
                src={
                  banPickObject[19].use
                    ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${banPickObject[19]?.name}_0.jpg`
                    : currentLocation === banPickObject[19].location
                      ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${cureentSelectedPick[0]?.name}_0.jpg`
                      : ''
                }
                layout="fill"
                objectFit="cover"
                objectPosition="top"
                className="scale-[100%]"
                alt=""
              />
            )}
          <span className="absolute bg-opacity-50 m-2">Sup</span>
        </div>
      </div>
      <div className="flex flex-col flex-[1] gap-2 pt-5">
        <div className="flex gap-2 justify-center w-full">
          <div className="border border-mainGold w-[60px] h-[60px]">
            {(banPickObject[0].use ||
              (currentLocation === banPickObject[0].location && cureentSelectedPick.length > 0)) &&
              side === 'left' && (
                <Image
                  src={
                    banPickObject[0].use
                      ? `https://ddragon.leagueoflegends.com/cdn/${banPickObject[0]?.info.version}/img/champion/${banPickObject[0]?.name}.png`
                      : currentLocation === banPickObject[0].location
                        ? `https://ddragon.leagueoflegends.com/cdn/${cureentSelectedPick[0]?.info.version}/img/champion/${cureentSelectedPick[0]?.name}.png`
                        : ``
                  }
                  width={60}
                  height={60}
                  alt=""
                />
              )}
            {(banPickObject[1].use ||
              (currentLocation === banPickObject[1].location && cureentSelectedPick.length > 0)) &&
              side === 'right' && (
                <Image
                  src={
                    banPickObject[1].use
                      ? `https://ddragon.leagueoflegends.com/cdn/${banPickObject[1]?.info.version}/img/champion/${banPickObject[1]?.name}.png`
                      : currentLocation === banPickObject[1].location
                        ? `https://ddragon.leagueoflegends.com/cdn/${cureentSelectedPick[0]?.info.version}/img/champion/${cureentSelectedPick[0]?.name}.png`
                        : ''
                  }
                  width={60}
                  height={60}
                  alt=""
                />
              )}
          </div>
          <div className="border border-mainGold w-[60px] h-[60px]">
            {(banPickObject[2].use ||
              (currentLocation === banPickObject[2].location && cureentSelectedPick.length > 0)) &&
              side === 'left' && (
                <Image
                  src={
                    banPickObject[2].use
                      ? `https://ddragon.leagueoflegends.com/cdn/${banPickObject[2]?.info.version}/img/champion/${banPickObject[2]?.name}.png`
                      : currentLocation === banPickObject[2].location
                        ? `https://ddragon.leagueoflegends.com/cdn/${cureentSelectedPick[0]?.info.version}/img/champion/${cureentSelectedPick[0]?.name}.png`
                        : ``
                  }
                  width={60}
                  height={60}
                  alt=""
                />
              )}

            {(banPickObject[3].use ||
              (currentLocation === banPickObject[3].location && cureentSelectedPick.length > 0)) &&
              side === 'right' && (
                <Image
                  src={
                    banPickObject[3].use
                      ? `https://ddragon.leagueoflegends.com/cdn/${banPickObject[3]?.info.version}/img/champion/${banPickObject[3]?.name}.png`
                      : currentLocation === banPickObject[3].location
                        ? `https://ddragon.leagueoflegends.com/cdn/${cureentSelectedPick[0]?.info.version}/img/champion/${cureentSelectedPick[0]?.name}.png`
                        : ''
                  }
                  width={60}
                  height={60}
                  alt=""
                />
              )}
          </div>
          <div className="border border-mainGold w-[60px] h-[60px]">
            {(banPickObject[4].use ||
              (currentLocation === banPickObject[4].location && cureentSelectedPick.length > 0)) &&
              side === 'left' && (
                <Image
                  src={
                    banPickObject[4].use
                      ? `https://ddragon.leagueoflegends.com/cdn/${banPickObject[4]?.info.version}/img/champion/${banPickObject[4]?.name}.png`
                      : currentLocation === banPickObject[4].location
                        ? `https://ddragon.leagueoflegends.com/cdn/${cureentSelectedPick[0]?.info.version}/img/champion/${cureentSelectedPick[0]?.name}.png`
                        : ``
                  }
                  width={60}
                  height={60}
                  alt=""
                />
              )}
            {(banPickObject[5].use ||
              (currentLocation === banPickObject[5].location && cureentSelectedPick.length > 0)) &&
              side === 'right' && (
                <Image
                  src={
                    banPickObject[5].use
                      ? `https://ddragon.leagueoflegends.com/cdn/${banPickObject[5]?.info.version}/img/champion/${banPickObject[5]?.name}.png`
                      : currentLocation === banPickObject[5].location
                        ? `https://ddragon.leagueoflegends.com/cdn/${cureentSelectedPick[0]?.info.version}/img/champion/${cureentSelectedPick[0]?.name}.png`
                        : ''
                  }
                  width={60}
                  height={60}
                  alt=""
                />
              )}
          </div>
        </div>
        <div className="flex gap-2 justify-center w-full">
          <div className="border border-mainGold w-[60px] h-[60px]">
            {(banPickObject[13].use ||
              (currentLocation === banPickObject[13].location && cureentSelectedPick.length > 0)) &&
              side === 'left' && (
                <Image
                  src={
                    banPickObject[13].use
                      ? `https://ddragon.leagueoflegends.com/cdn/${banPickObject[13]?.info.version}/img/champion/${banPickObject[13]?.name}.png`
                      : currentLocation === banPickObject[13].location
                        ? `https://ddragon.leagueoflegends.com/cdn/${cureentSelectedPick[0]?.info.version}/img/champion/${cureentSelectedPick[0]?.name}.png`
                        : ``
                  }
                  width={60}
                  height={60}
                  alt=""
                />
              )}
            {(banPickObject[12].use ||
              (currentLocation === banPickObject[12].location && cureentSelectedPick.length > 0)) &&
              side === 'right' && (
                <Image
                  src={
                    banPickObject[12].use
                      ? `https://ddragon.leagueoflegends.com/cdn/${banPickObject[12]?.info.version}/img/champion/${banPickObject[12]?.name}.png`
                      : currentLocation === banPickObject[12].location
                        ? `https://ddragon.leagueoflegends.com/cdn/${cureentSelectedPick[0]?.info.version}/img/champion/${cureentSelectedPick[0]?.name}.png`
                        : ''
                  }
                  width={60}
                  height={60}
                  alt=""
                />
              )}
          </div>
          <div className="border border-mainGold w-[60px] h-[60px]">
            {(banPickObject[15].use ||
              (currentLocation === banPickObject[15].location && cureentSelectedPick.length > 0)) &&
              side === 'left' && (
                <Image
                  src={
                    banPickObject[15].use
                      ? `https://ddragon.leagueoflegends.com/cdn/${banPickObject[15]?.info.version}/img/champion/${banPickObject[15]?.name}.png`
                      : currentLocation === banPickObject[15].location
                        ? `https://ddragon.leagueoflegends.com/cdn/${cureentSelectedPick[0]?.info.version}/img/champion/${cureentSelectedPick[0]?.name}.png`
                        : ``
                  }
                  width={60}
                  height={60}
                  alt=""
                />
              )}
            {(banPickObject[14].use ||
              (currentLocation === banPickObject[14].location && cureentSelectedPick.length > 0)) &&
              side === 'right' && (
                <Image
                  src={
                    banPickObject[14].use
                      ? `https://ddragon.leagueoflegends.com/cdn/${banPickObject[14]?.info.version}/img/champion/${banPickObject[14]?.name}.png`
                      : currentLocation === banPickObject[14].location
                        ? `https://ddragon.leagueoflegends.com/cdn/${cureentSelectedPick[0]?.info.version}/img/champion/${cureentSelectedPick[0]?.name}.png`
                        : ''
                  }
                  width={60}
                  height={60}
                  alt=""
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
