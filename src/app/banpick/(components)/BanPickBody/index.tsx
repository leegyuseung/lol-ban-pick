import PickChampions from '../PickChampions';
import SelectChampions from '../SelectChampions';

export default function BanPickBody() {
  return (
    <div className="flex justify-center h-full">
      <PickChampions></PickChampions>
      <SelectChampions></SelectChampions>
      <PickChampions></PickChampions>
    </div>
  );
}
