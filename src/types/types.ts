export interface ApiResponse<T> {
  result_code: number;
  result: T;
  message: string;
}

export type FormsData = {
  myTeam: string;
  yourTeam: string;
  banpickMode: 'tournament' | 'peerless3' | 'peerless5';
  peopleMode: 'solo' | 'team';
  timeUnlimited: 'true' | 'false';
  myTeamSide: 'red' | 'blue';
  myImg: string;
  yourImg: string;
  nowSet: number;
};

export interface ChampionInfoI {
  blurb: string;
  id: string;
  key: string;
  name: string;
  partype: string;
  tags: string[];
  title: string;
  version: string;
  status: string;
  line: string[];
}
export interface RulesState {
  myTeam: string;
  yourTeam: string;
  banpickMode: 'tournament' | 'peerless3' | 'peerless5';
  peopleMode: 'solo' | 'team';
  timeUnlimited: 'true' | 'false';
  myTeamSide: 'red' | 'blue'; // teamSide가 나의 team을 담고 있어야한다
  myImg: string;
  yourImg: string;

  // 피어리스 세트를 담아야한다
  nowSet: number;

  setRules: (data: FormsData) => void;
  setPeerlessSet: () => void;
  setClearPeerlessSet: () => void;
};