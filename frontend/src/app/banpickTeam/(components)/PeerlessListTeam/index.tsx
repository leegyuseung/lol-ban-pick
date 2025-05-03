'use client';
import PeerlessImage from '@/app/banpickTeam/(components)/PeerlessListTeam/PeerlessImageTeam';
import { useEffect, useRef } from 'react';
import { usePeerlessStore, useRulesStore } from '@/store';
import { BanObjectType } from '@/types';
import { banPickModeOptions, sideOptions, teamSideOptions } from '@/constants';

type PropsType = {
  side: string;
  teamSide: string;
};

export default function PeerlessList({ side, teamSide }: PropsType) {
  const { banpickMode } = useRulesStore();
  const BlueBanDataRef = useRef<BanObjectType[][]>([]);
  const RedBanDataRef = useRef<BanObjectType[][]>([]);

  useEffect(() => {
    // 초기 상태 설정
    const initialState = usePeerlessStore.getState();
    const { hostBan, guestBan } = initialState;
    const { myTeamSide } = useRulesStore.getState().hostInfo;

    if (myTeamSide === teamSideOptions.BLUE) {
      BlueBanDataRef.current = hostBan;
      RedBanDataRef.current = guestBan;
    } else if (myTeamSide === teamSideOptions.RED) {
      RedBanDataRef.current = hostBan;
      BlueBanDataRef.current = guestBan;
    }

    // PeerlessStore 구독
    const unsubscribePeerless = usePeerlessStore.subscribe((state) => {
      const { hostBan, guestBan } = state;
      const { myTeamSide } = useRulesStore.getState().hostInfo;

      if (myTeamSide === teamSideOptions.BLUE) {
        BlueBanDataRef.current = hostBan;
        RedBanDataRef.current = guestBan;
      } else if (myTeamSide === teamSideOptions.RED) {
        RedBanDataRef.current = hostBan;
        BlueBanDataRef.current = guestBan;
      }
    });

    // RulesStore 구독
    const unsubscribeRules = useRulesStore.subscribe((state) => {
      const { hostBan, guestBan } = usePeerlessStore.getState();
      const { myTeamSide } = state.hostInfo;

      if (myTeamSide === teamSideOptions.BLUE) {
        BlueBanDataRef.current = hostBan;
        RedBanDataRef.current = guestBan;
      } else if (myTeamSide === teamSideOptions.RED) {
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
    <div className={`flex flex-col flex-[2] ${side === sideOptions.LEFT ? 'md:order-1' : 'md:order-5'}`}>
      {banpickMode !== banPickModeOptions.TNM &&
        side === sideOptions.LEFT &&
        teamSide === teamSideOptions.BLUE &&
        BlueBanDataRef.current.map((ban, index) => <PeerlessImage key={index} ban={ban} />)}

      {banpickMode !== banPickModeOptions.TNM &&
        side === sideOptions.RIGHT &&
        teamSide === teamSideOptions.RED &&
        RedBanDataRef.current.map((ban, index) => <PeerlessImage key={index} ban={ban} />)}
    </div>
  );
}
