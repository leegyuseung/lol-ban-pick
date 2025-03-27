import PeerlessList from '../PeerlessListTeam';
import PickChampions from '../PickChampionsTeam';
import SelectChampions from '../SelectChampionsTeam';

export default function BanPickBody() {
  return (
    <div className="flex justify-center h-full">
      <PeerlessList side="left" teamSide="blue" />
      <PickChampions side="left" />
      <SelectChampions />
      <PickChampions side="right" />
      <PeerlessList side="right" teamSide="red" />
    </div>
  );
}
