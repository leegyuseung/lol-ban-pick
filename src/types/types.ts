export interface ApiResponse<T> {
  result_code: number;
  result: T;
  message: string;
}

export type FormsData = {
  blueTeam: string;
  blueImg: string;
  redImg: string;
  redTeam: string;
  banpickMode: 'tournament' | 'peerless3' | 'peerless5';
  peopleMode: 'solo' | 'team';
  timeUnlimited: string;
  teamSide: 'red' | 'blue' | 'solo';
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
