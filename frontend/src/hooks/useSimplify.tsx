import { ChampionInfoI, ChampionInfoType } from '@/types';

export default async function useSimplify(infoData: ChampionInfoI): Promise<ChampionInfoType> {
  if (!infoData) return { id: '', line: [], name: '', status: '', version: '' };
  const newInfo = {
    id: infoData.id,
    line: infoData.line,
    name: infoData.name,
    status: infoData.status,
    version: infoData.version,
  };
  return newInfo;
}
