import { ChampionInfoI, ChampionInfoType } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { type: string } }) {
  const { type } = params;

  const versionRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
  const versions = await versionRes.json();
  const latestVersion = versions[0];

  if (type === 'version') {
    return NextResponse.json({ version: latestVersion });
  } else if (type === 'name') {
    const championsRes = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/ko_KR/champion.json`,
    );
    const championInfoData = (await championsRes.json()).data;

    const championInfo = Object.fromEntries(
      Object.entries(championInfoData)
        .filter(([_, value]) => typeof value === 'object' && value !== null) // 객체만 필터링
        .sort(([, infoA], [, infoB]) =>
          (infoA as ChampionInfoI).name.localeCompare((infoB as ChampionInfoI).name, 'ko-KR'),
        )
        .map(([key, value]) => {
          const data = value as ChampionInfoI;

          return [
            key,
            {
              id: data.id,
              name: data.name,
              version: data.version,
              status: '',
            },
          ];
        }),
    );
    return NextResponse.json({ championInfo });
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }
}
