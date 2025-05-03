'use client';
import PeerlessImage from '@/app/banpick/(components)/PeerlessList/PeerlessImage';
import { banPickModeOptions, sideOptions, teamSideOptions } from '@/constants';
import { usePeerlessStore, useRulesStore } from '@/store';

type PropsType = {
  side: string;
};

export default function PeerlessList({ side }: PropsType) {
  const { banpickMode } = useRulesStore();
  const { hostBan, guestBan } = usePeerlessStore();
  const { hostInfo } = useRulesStore();

  const Mode = [
    {
      TeamSide: teamSideOptions.BLUE,
      Side: sideOptions.LEFT,
      Ban: hostBan,
    },
    {
      TeamSide: teamSideOptions.RED,
      Side: sideOptions.LEFT,
      Ban: guestBan,
    },
    {
      TeamSide: teamSideOptions.BLUE,
      Side: sideOptions.RIGHT,
      Ban: guestBan,
    },
    {
      TeamSide: teamSideOptions.RED,
      Side: sideOptions.RIGHT,
      Ban: hostBan,
    },
  ];

  return (
    <div className={`flex flex-col flex-[2] ${side === sideOptions.LEFT ? 'md:order-1' : 'md:order-5'}`}>
      {Mode.map(
        (mode) =>
          banpickMode !== banPickModeOptions.TNM &&
          hostInfo.myTeamSide === mode.TeamSide &&
          side === mode.Side &&
          mode.Ban.map((ban, index) => <PeerlessImage key={index} ban={ban} />),
      )}
    </div>
  );
}
