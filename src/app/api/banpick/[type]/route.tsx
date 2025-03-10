import { NextResponse } from 'next/server';
interface ChampType extends Record<string, unknown> {
  imagePath: string;
}

export async function GET(req: Request, { params }: { params: { type: string } }) {
  const { type } = params;

  const versionRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
  const versions = await versionRes.json();
  const latestVersion = versions[0];

  if (type === 'version') {
    return NextResponse.json({ version: latestVersion });
  } else if (type === 'name') {
    const championsRes = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`,
    );
    const championInfo = (await championsRes.json()).data;
    Object.entries(championInfo as Record<string, ChampType>).forEach(([name, info]) => {
      info.imagePath = `/images/champions/tiles/${name}_0.jpg`;
    });
    return NextResponse.json({ championInfo });
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }
}
