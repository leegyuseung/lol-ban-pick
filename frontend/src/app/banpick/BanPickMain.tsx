import BanPickBody from '@/app/banpick/(components)/BanPickBody';
import BanPickHeader from '@/app/banpick/(components)/BanPickHeader';

export default function BanPickMain() {
  return (
    <div className="flex flex-col h-screen gap-2">
      <BanPickHeader />
      <BanPickBody />
    </div>
  );
}
