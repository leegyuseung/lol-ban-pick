export interface ApiResponse<T> {
  result_code: number;
  result: T;
  message: string;
}

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

export type FormsData = {
  blueTeamName: string;
  redTeamName: string;
  banpickMode: 'tournament' | 'peerless3' | 'peerless5';
  peopleMode: 'solo' | 'team';
  timeUnlimited: 'true' | 'false';
  myTeamSide: 'red' | 'blue';
  yourTeamSide: 'red' | 'blue';
  blueImg: string;
  redImg: string;
  nowSet: number;
};

export type RulesType = {
  banpickMode: 'tournament' | 'peerless3' | 'peerless5';
  peopleMode: 'solo' | 'team';
  timeUnlimited: 'true' | 'false';
  nowSet: number;
  position: 'blue' | 'red';
  role: 'host' | 'guest';
};

type InfoType = {
  myTeam: string;
  yourTeam: string;
  myTeamSide: 'blue' | 'red';
  yourTeamSide: 'blue' | 'red';
  myImg: string;
  yourImg: string;
};

export interface RulesState extends RulesType {
  hostInfo: InfoType;
  guestInfo: InfoType;
  setRules: (data: RulesType) => void;
  setFormRules: (data: FormsData) => void;
  setHostRules: (data: FormsData) => void;
  setGuestRules: (data: FormsData) => void;
  setPeerlessSet: () => void;
  setClearPeerlessSet: () => void;
}
