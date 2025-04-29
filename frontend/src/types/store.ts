import { BanObjectType, ChampionInfoI } from '.';

type ChampionStoreType = {
  championInfo: Record<string, ChampionInfoI>;
  setChampionInfo: () => Promise<void>;
  setChangeChampionInfo: (name: string, banPick: string) => void;
};

type PeerlessStoreType = {
  redBan: BanObjectType[];
  blueBan: BanObjectType[];

  setRedBan: (obj: BanObjectType) => void;
  setBlueBan: (obj: BanObjectType) => void;

  setRedBanClear: () => void;
  setBlueBanClear: () => void;

  hostBan: BanObjectType[][];
  guestBan: BanObjectType[][];
  setHostBan: (array: BanObjectType[]) => void;
  setTeamBan: (blue: BanObjectType[], red: BanObjectType[]) => void;
  setGuestBan: (array: BanObjectType[]) => void;
  setClearHostBan: () => void;
  setClearGuestBan: () => void;
  setTeamPeerless: () => void;
  clearTeamPeerless: () => void;
  setTeamChange: () => void;
};

export type { ChampionStoreType, PeerlessStoreType };
