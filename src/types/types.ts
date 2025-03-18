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
