'use client';
import PeerlessImage from './PeerlessImageTeam';
import { useEffect, useRef } from 'react';
import { InfoType } from '@/types/types';
import { usePeerlessStore, useRulesStore } from '@/store';
import { BanArray } from '@/store/banpick';

type PropsType = {
  side: string;
  teamSide: string;
};

export default function PeerlessList({ side, teamSide }: PropsType) {
  const { banpickMode } = useRulesStore();
  const { hostInfo, guestInfo, role } = useRulesStore();
  const InfoDataRef = useRef<InfoType>();
  const BlueBanDataRef = useRef<BanArray[][]>([]);
  const RedBanDataRef = useRef<BanArray[][]>([]);

  useEffect(() => {
    if (role === 'host') {
      InfoDataRef.current = hostInfo;
    } else if (role === 'guest') {
      InfoDataRef.current = guestInfo;
    } else if (role === 'audience') {
      InfoDataRef.current = {
        myTeam: '',
        yourTeam: '',
        myTeamSide: 'audience',
        yourTeamSide: 'audience',
        myImg: '',
        yourImg: '',
      };
    }
  }, [role, hostInfo, guestInfo]);

  useEffect(() => {
    // store 구독
    const unsubscribe = usePeerlessStore.subscribe((state) => {
      const { hostBan, guestBan } = state;

      if (hostInfo.myTeamSide === 'blue') {
        BlueBanDataRef.current = hostBan;
        RedBanDataRef.current = guestBan;
      } else if (hostInfo.myTeamSide === 'red') {
        RedBanDataRef.current = hostBan;
        BlueBanDataRef.current = guestBan;
      }
    });

    return () => unsubscribe();
  }, [hostInfo.myTeamSide]);

  return (
    <div className="flex flex-col flex-[2]">
      {banpickMode !== 'tournament' &&
        side === 'left' &&
        teamSide === 'blue' &&
        BlueBanDataRef.current.map((ban, index) => <PeerlessImage key={index} ban={ban} />)}

      {banpickMode !== 'tournament' &&
        side === 'right' &&
        teamSide === 'red' &&
        RedBanDataRef.current.map((ban, index) => <PeerlessImage key={index} ban={ban} />)}
    </div>
  );
}
