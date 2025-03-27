'use client';
import PeerlessImage from './PeerlessImage';
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
      TeamSide: 'blue',
      Side: 'left',
      Ban: hostBan,
    },
    {
      TeamSide: 'red',
      Side: 'left',
      Ban: guestBan,
    },
    {
      TeamSide: 'blue',
      Side: 'right',
      Ban: guestBan,
    },
    {
      TeamSide: 'red',
      Side: 'right',
      Ban: hostBan,
    },
  ];

  return (
    <div className="flex flex-col flex-[2]">
      {Mode.map(
        (mode) =>
          banpickMode !== 'tournament' &&
          hostInfo.myTeamSide === mode.TeamSide &&
          side === mode.Side &&
          mode.Ban.map((ban, index) => <PeerlessImage key={index} ban={ban} />),
      )}
    </div>
  );
}
