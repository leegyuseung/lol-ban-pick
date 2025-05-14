import { sideOptions, teamSideOptions } from '@/constants';
import { KakaoAdIngame } from '@/components/KaKaoAd';
import PeerlessList from '@/app/banpickTeam/(components)/PeerlessListTeam';
import PickChampions from '@/app/banpickTeam/(components)/PickChampionsTeam';
import SelectChampions from '@/app/banpickTeam/(components)/SelectChampionsTeam';

export default function BanPickBody() {
  return (
    <div className="md:flex justify-center h-full">
      <SelectChampions />
      <PeerlessList side={sideOptions.LEFT} teamSide={teamSideOptions.BLUE} />
      <PickChampions side={sideOptions.LEFT} />
      <PickChampions side={sideOptions.RIGHT} />
      <PeerlessList side={sideOptions.RIGHT} teamSide={teamSideOptions.RED} />
      <KakaoAdIngame />
    </div>
  );
}
