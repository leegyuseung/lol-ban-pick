import { sideOptions, teamSideOptions } from '@/constants';
import PeerlessList from '@/app/banpickTeam/(components)/PeerlessListTeam';
import PickChampions from '@/app/banpickTeam/(components)/PickChampionsTeam';
import SelectChampions from '@/app/banpickTeam/(components)/SelectChampionsTeam';

export default function BanPickBody() {
  return (
    <div className="flex justify-center h-full">
      <PeerlessList side={sideOptions.LEFT} teamSide={teamSideOptions.BLUE} />
      <PickChampions side={sideOptions.LEFT} />
      <SelectChampions />
      <PickChampions side={sideOptions.RIGHT} />
      <PeerlessList side={sideOptions.RIGHT} teamSide={teamSideOptions.RED} />
    </div>
  );
}
