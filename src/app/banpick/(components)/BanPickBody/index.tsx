import PeerlessList from '../PeerlessList';
import PickChampions from '../PickChampions';
import SelectChampions from '../SelectChampions';

export default function BanPickBody() {
  return (
    <div className="flex justify-center h-full">
      <PeerlessList side="left" />
      <PickChampions side="left" />
      <SelectChampions />
      <PickChampions side="right" />
      <PeerlessList side="right" />
    </div>
  );
}
