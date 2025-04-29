import { sideOptions } from '@/constants';
import PeerlessList from '../PeerlessList';
import PickChampions from '../PickChampions';
import SelectChampions from '../SelectChampions';

export default function BanPickBody() {
  return (
    <div className="flex justify-center h-full">
      <PeerlessList side={sideOptions.LEFT} />
      <PickChampions side={sideOptions.LEFT} />
      <SelectChampions />
      <PickChampions side={sideOptions.RIGHT} />
      <PeerlessList side={sideOptions.RIGHT} />
    </div>
  );
}
