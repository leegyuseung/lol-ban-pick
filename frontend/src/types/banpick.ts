import { ChampionInfoType } from '.';

type BanObjectType = {
  name: string;
  line: number;
  info: ChampionInfoType;
};

type currentSelectedPickType = {
  name: string;
  info: ChampionInfoType;
}[];

type BanPickObjectType = {
  index: number;
  location: string;
  name: string;
  info: ChampionInfoType;
  use: boolean;
  random: boolean;
  status: string;
}[];

interface BanI {
  championInfo: Record<string, ChampionInfoType>;
  setChampionInfo: () => Promise<void>;
  setChangeChampionInfo: (name: string, banPick: string) => void;
  setChangeChampionPeerInfo: (myBan: BanObjectType[][], yourBan: BanObjectType[][]) => void;

  currentSelectedPick: currentSelectedPickType;
  setCurrentSelectedPick: (name: string, info: ChampionInfoType) => void;

  banPickObject: BanPickObjectType;
  setBanPickObject: (index: number, name: string, info: ChampionInfoType, ran: boolean) => void;
  setClearBanPickObject: () => void;

  currentLocation: string;
  setCurrentLocation: (index: number) => void;
  setClearCurrentLocation: () => void;

  selectedTeam: {
    color: string;
    banpick: string;
    line: string;
  }[];
  selectedTeamIndex: number;
  setSelectedTeamIndex: () => void;
  setClearSelectTeamIndex: () => void;

  RandomPick: () => void;

  headerSecond: string;
  setHeaderSecond: (second: string) => void;
}

interface TeamBanI {
  SelectTeamImage: (name: string, info: ChampionInfoType) => void;
  SelectTeamChampion: () => void;
  TeamRandomPick: () => void;
}

interface SelectedChampionImagePropsI {
  banPickObject: BanPickObjectType;
  currentSelectedPick: currentSelectedPickType;
  currentLocation: string;
  index: number;
  side: string;
  location: string;
}
export type { BanObjectType, currentSelectedPickType, BanPickObjectType, BanI, TeamBanI, SelectedChampionImagePropsI };
