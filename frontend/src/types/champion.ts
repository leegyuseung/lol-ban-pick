type ChampionInfoType = {
  id: string;
  line: string[];
  name: string;
  version: string;
  status: string;
  Iposition: string;
};

interface ChampionInfoI extends ChampionInfoType {
  blurb: string;
  key: string;
  partype: string;
  tags: string[];
  title: string;
}

export type { ChampionInfoI, ChampionInfoType };
