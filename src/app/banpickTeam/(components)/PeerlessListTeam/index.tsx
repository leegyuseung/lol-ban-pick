'use client';
import PeerlessImage from './PeerlessImageTeam';
import { usePeerlessStore, useRulesStore } from '@/store';

type PropsType = {
  side: string;
};

export default function PeerlessList({ side }: PropsType) {
  const { banpickMode } = useRulesStore();
  const { myBan, yourBan } = usePeerlessStore();
  const { hostInfo } = useRulesStore();

  const Mode = [
    {
      Mode: 'tournament',
      TeamSide: 'blue',
      Side: 'left',
      Ban: myBan,
    },
    {
      Mode: 'tournament',
      TeamSide: 'red',
      Side: 'left',
      Ban: yourBan,
    },
    {
      Mode: 'tournament',
      TeamSide: 'blue',
      Side: 'right',
      Ban: yourBan,
    },
    {
      Mode: 'tournament',
      TeamSide: 'red',
      Side: 'right',
      Ban: myBan,
    },
  ];

  return (
    <div className="flex flex-col flex-[2]">
      {Mode.map(
        (mode) =>
          banpickMode !== mode.Mode &&
          hostInfo.myTeamSide === mode.TeamSide &&
          side === mode.Side &&
          mode.Ban.map((ban, index) => <PeerlessImage key={index} ban={ban} />),
      )}
    </div>
  );
}
