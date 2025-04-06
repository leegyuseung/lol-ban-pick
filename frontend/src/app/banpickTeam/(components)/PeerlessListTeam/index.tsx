'use client';
import PeerlessImage from './PeerlessImageTeam';
import { useEffect, useRef } from 'react';
import { usePeerlessStore, useRulesStore } from '@/store';
import { BanArray } from '@/store/banpick';

type PropsType = {
  side: string;
  teamSide: string;
};

export default function PeerlessList({ side, teamSide }: PropsType) {
  const { banpickMode } = useRulesStore();
  const BlueBanDataRef = useRef<BanArray[][]>([]);
  const RedBanDataRef = useRef<BanArray[][]>([]);

  useEffect(() => {
    // 초기 상태 설정
    const initialState = usePeerlessStore.getState();
    const { hostBan, guestBan } = initialState;
    const { myTeamSide } = useRulesStore.getState().hostInfo;

    if (myTeamSide === 'blue') {
      BlueBanDataRef.current = hostBan;
      RedBanDataRef.current = guestBan;
    } else if (myTeamSide === 'red') {
      RedBanDataRef.current = hostBan;
      BlueBanDataRef.current = guestBan;
    }

    // PeerlessStore 구독
    const unsubscribePeerless = usePeerlessStore.subscribe((state) => {
      const { hostBan, guestBan } = state;
      const { myTeamSide } = useRulesStore.getState().hostInfo;

      if (myTeamSide === 'blue') {
        BlueBanDataRef.current = hostBan;
        RedBanDataRef.current = guestBan;
      } else if (myTeamSide === 'red') {
        RedBanDataRef.current = hostBan;
        BlueBanDataRef.current = guestBan;
      }
    });

    // RulesStore 구독
    const unsubscribeRules = useRulesStore.subscribe((state) => {
      const { hostBan, guestBan } = usePeerlessStore.getState();
      const { myTeamSide } = state.hostInfo;

      if (myTeamSide === 'blue') {
        BlueBanDataRef.current = hostBan;
        RedBanDataRef.current = guestBan;
      } else if (myTeamSide === 'red') {
        RedBanDataRef.current = hostBan;
        BlueBanDataRef.current = guestBan;
      }
    });

    // cleanup 함수
    return () => {
      unsubscribePeerless();
      unsubscribeRules();
    };
  }, []); // 의존성 배열을 비워서 마운트 시에만 실행

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
