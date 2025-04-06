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
  myTeamSide: 'red' | 'blue' | 'audience';
  yourTeamSide: 'red' | 'blue' | 'audience';
  blueImg: string;
  redImg: string;
  nowSet: number;
  myTeam: string;
  yourTeam: string;
  myImg?: string;
  yourImg?: string;
};

export type RulesType = {
  banpickMode: 'tournament' | 'peerless3' | 'peerless5';
  peopleMode: 'solo' | 'team';
  timeUnlimited: 'true' | 'false';
  nowSet: number;
  position?: 'blue' | 'red' | 'audience' | undefined;
  role: 'host' | 'guest' | 'audience';
  audienceCount: number;
};

export type InfoType = {
  myTeam: string;
  yourTeam: string;
  myTeamSide: 'blue' | 'red' | 'audience';
  yourTeamSide: 'blue' | 'red' | 'audience';
  myImg: string;
  yourImg: string;
  host?: boolean;
  status?: 'join' | 'ready' | '';
};

export interface RulesState extends RulesType {
  hostInfo: InfoType;
  guestInfo: InfoType;
  setRules: (data: RulesType) => void;
  setFormRules: (data: FormsData) => void;
  setHostRules: (data: FormsData & { status: 'join' | 'ready' | '' }) => void;
  setGuestRules: (data: FormsData & { status: 'join' | 'ready' | '' }) => void;
  setChangeTeam: () => void;
  setPeerlessSet: () => void;
  setClearPeerlessSet: () => void;
}
