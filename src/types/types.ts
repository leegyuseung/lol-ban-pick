export interface ApiResponse<T> {
  result_code: number;
  result: T;
  message: string;
}

export type FormsData = {
  blueTeam: string;
  redTeam: string;
  banpickMode: 'tournament' | 'peerless';
  peopleMode: 'solo' | 'one' | 'five';
  timeUnlimited: boolean;
  teamSide: 'red' | 'blue' | 'solo';
};
