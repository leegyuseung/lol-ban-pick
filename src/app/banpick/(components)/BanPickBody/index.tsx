import PeerlessList from '../PeerlessList';
import PickChampions from '../PickChampions';
import SelectChampions from '../SelectChampions';

export default function BanPickBody() {
  return (
    <div className="flex justify-center h-full">
      <PeerlessList />
      <PickChampions side="left" />
      <SelectChampions />
      <PickChampions side="right" />
      <PeerlessList />
    </div>
  );
}
