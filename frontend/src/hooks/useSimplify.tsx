import { ChampionInfoType } from '@/types';

export default async function useSimplify(infoData: ChampionInfoType): Promise<ChampionInfoType> {
  if (!infoData) return { id: '', line: [], name: '', status: '', version: '', Iposition: '' };
  const newInfo = {
    id: infoData.id,
    line: infoData.line,
    name: infoData.name,
    status: infoData.status,
    version: infoData.version,
    Iposition: infoData.Iposition,
  };
  return newInfo;
}
