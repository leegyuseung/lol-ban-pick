import PeerlessList from '../PeerlessList';
import PickChampions from '../PickChampions';
import SelectChampions from '../SelectChampions';

export default function BanPickBody() {
  return (
    <div className="flex justify-center h-full">
      <PeerlessList></PeerlessList>
      <PickChampions side="left"></PickChampions>
      <SelectChampions></SelectChampions>
      <PickChampions side="right"></PickChampions>
      <PeerlessList></PeerlessList>
    </div>
  );
}
