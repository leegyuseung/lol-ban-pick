import BanPickHeader from './(components)/BanPickHeader';
import PickChampions from './(components)/PickChampions';
import SelectChampions from './(components)/SelectChampions';

export default function BanPickMain() {
  return (
    <>
      <BanPickHeader />
      <PickChampions></PickChampions>
      <SelectChampions></SelectChampions>
      <PickChampions></PickChampions>
    </>
  );
}
