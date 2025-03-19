import { FormsData } from '@/types/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type RulesState = {
  myTeam: string;
  yourTeam: string;
  banpickMode: 'tournament' | 'peerless3' | 'peerless5';
  peopleMode: 'solo' | 'team';
  timeUnlimited: 'true' | 'false';
  myTeamSide: 'red' | 'blue'; // teamSide가 나의 team을 담고 있어야한다
  myImg: string;
  yourImg: string;
  position?:string;
  // 피어리스 세트를 담아야한다
  nowSet: number;

  setRules: (data: FormsData & { position?: string }) => void;
  setPeerlessSet: () => void;
  setClearPeerlessSet: () => void;
};

export const useRulesStore = create<RulesState>()(
  persist(
    (set) => ({
      myTeam: '',
      yourTeam: '',
      banpickMode: 'tournament',
      peopleMode: 'solo',
      timeUnlimited: 'true',
      myTeamSide: 'blue',
      myImg: '',
      yourImg: '',
      nowSet: 1,
      position:'blue',
      setRules: (data: FormsData & { position?: string }) =>
        set({
          myTeam:
            data.peopleMode === 'solo'
              ? data.myTeam === ''
                ? '블루팀'
                : data.myTeam
              : data.myTeamSide === 'blue'
                ? data.myTeam
                : data.yourTeam,
          yourTeam:
            data.peopleMode === 'solo'
              ? data.yourTeam === ''
                ? '레드팀'
                : data.yourTeam
              : data.myTeamSide === 'blue'
                ? data.yourTeam
                : data.myTeam,
          banpickMode: data.banpickMode,
          peopleMode: data.peopleMode,
          timeUnlimited: data.peopleMode === 'solo' ? data.timeUnlimited : 'true',
          myTeamSide: data.peopleMode === 'solo' ? 'blue' : data.myTeamSide,
          myImg: data.peopleMode === 'solo' ? data.myImg : data.myTeamSide === 'blue' ? data.myImg : data.yourImg,
          yourImg: data.peopleMode === 'solo' ? data.yourImg : data.myTeamSide === 'blue' ? data.yourImg : data.myImg,
          position:data.position
        }),

      setPeerlessSet: () =>
        set((state) => {
          return { nowSet: state.nowSet + 1 };
        }),

      setClearPeerlessSet: () =>
        set(() => {
          localStorage.removeItem('rules-store');
          return { nowSet: 1 };
        }),
    }),
    { name: 'rules-store' },
  ),
);
