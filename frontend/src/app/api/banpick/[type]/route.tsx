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
    const championInfo = (await championsRes.json()).data;
    return NextResponse.json({ championInfo });
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }
}
