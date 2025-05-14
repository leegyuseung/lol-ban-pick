import PeerlessList from '@/app/banpick/(components)/PeerlessList';
import PickChampions from '@/app/banpick/(components)/PickChampions';
import SelectChampions from '@/app/banpick/(components)/SelectChampions';
import { KakaoAdIngame } from '@/components/KaKaoAd';
import { sideOptions } from '@/constants';

export default function BanPickBody() {
  return (
    <div className="md:flex justify-center h-full">
      <SelectChampions />
      <PeerlessList side={sideOptions.LEFT} />
      <PickChampions side={sideOptions.LEFT} />
      <PickChampions side={sideOptions.RIGHT} />
      <PeerlessList side={sideOptions.RIGHT} />
      <KakaoAdIngame />
    </div>
  );
}
