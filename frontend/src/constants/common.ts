const filterOptions = ['top', 'jungle', 'mid', 'ad', 'sup'];

const lineMappingOptions: Record<string, number> = {
  top: 0,
  jungle: 1,
  mid: 2,
  ad: 3,
  sup: 4,
};

const ImageList = ['t1', 'hanwha', 'geng', 'kia', 'kt', 'dn', 'ok'];
const ImageListPng = ['drx', 'ns'];

const banPickModeOptions = {
  TNM: 'tournament',
  PRL3: 'peerless3',
  PRL5: 'peerless5',
} as const;

const peopleModeOptions = {
  SOLO: 'solo',
  TEAM: 'team',
} as const;

const infoStatusOptions = {
  JOIN: 'join',
  READY: 'ready',
  NO: 'no',
};

const roleOptions = {
  HOST: 'host',
  GUEST: 'guest',
  AUD: 'audience',
} as const;

const teamSideOptions = {
  BLUE: 'blue',
  RED: 'red',
  AUD: 'audience',
} as const;

const sideOptions = {
  LEFT: 'left',
  RIGHT: 'right',
} as const;

const locationOptions = {
  BLUEB1: 'blueBan1',
  BLUEB2: 'blueBan2',
  BLUEB3: 'blueBan3',
  BLUEB4: 'blueBan4',
  BLUEB5: 'blueBan5',
  REDB1: 'redBan1',
  REDB2: 'redBan2',
  REDB3: 'redBan3',
  REDB4: 'redBan4',
  REDB5: 'redBan5',
  REDP1: 'redPick1',
  REDP2: 'redPick2',
  REDP3: 'redPick3',
  REDP4: 'redPick4',
  REDP5: 'redPick5',
  BLUEP1: 'bluePick1',
  BLUEP2: 'bluePick2',
  BLUEP3: 'bluePick3',
  BLUEP4: 'bluePick4',
  BLUEP5: 'bluePick5',
} as const;

const statusOptions = {
  PICK: 'pick',
  BAN: 'ban',
  PEER: 'peer',
  NO: '',
} as const;

const lineOptions = {
  TOP: 'top',
  JUG: 'jungle',
  MID: 'mid',
  AD: 'ad',
  SUP: 'sup',
  NO: '',
} as const;

const teamcolorOptions = {
  BLUE: 'blue',
  RED: 'red',
  NO: '',
} as const;

const booleanOptions = {
  TRUE: 'true',
  FALSE: 'false',
};

export {
  ImageList,
  ImageListPng,
  filterOptions,
  roleOptions,
  teamSideOptions,
  lineMappingOptions,
  sideOptions,
  locationOptions,
  statusOptions,
  lineOptions,
  teamcolorOptions,
  banPickModeOptions,
  peopleModeOptions,
  infoStatusOptions,
  booleanOptions,
};
