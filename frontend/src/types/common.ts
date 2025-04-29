type FormsType = {
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

type RulesType = {
  banpickMode: 'tournament' | 'peerless3' | 'peerless5';
  peopleMode: 'solo' | 'team';
  timeUnlimited: 'true' | 'false';
  nowSet: number;
  position?: 'blue' | 'red' | 'audience' | undefined;
  role: 'host' | 'guest' | 'audience';
  audienceCount: number;
};

type InfoType = {
  myTeam: string;
  yourTeam: string;
  myTeamSide: 'blue' | 'red' | 'audience';
  yourTeamSide: 'blue' | 'red' | 'audience';
  myImg: string;
  yourImg: string;
  host?: boolean;
  status?: 'join' | 'ready' | '';
};

interface RulesStateI extends RulesType {
  hostInfo: InfoType;
  guestInfo: InfoType;
  setRules: (data: RulesType) => void;
  setFormRules: (data: FormsType) => void;
  setHostRules: (data: FormsType & { status: 'join' | 'ready' | '' }) => void;
  setGuestRules: (data: FormsType & { status: 'join' | 'ready' | '' }) => void;
  setChangeTeam: () => void;
  setPeerlessSet: () => void;
  setClearPeerlessSet: () => void;
}

export type { FormsType, RulesType, InfoType, RulesStateI };
