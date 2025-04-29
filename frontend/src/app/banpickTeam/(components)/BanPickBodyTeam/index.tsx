import { sideOptions, teamSideOptions } from '@/constants';
import PeerlessList from '../PeerlessListTeam';
import PickChampions from '../PickChampionsTeam';
import SelectChampions from '../SelectChampionsTeam';

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
