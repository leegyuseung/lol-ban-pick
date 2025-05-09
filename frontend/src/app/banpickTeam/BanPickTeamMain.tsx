import BanPickBody from '@/app/banpickTeam/(components)/BanPickBodyTeam';
import BanPickHeader from '@/app/banpickTeam/(components)/BanPickHeaderTeam';

export default function BanPickMain() {
  return (
    <div className="flex flex-col min-w-[375px h-screen gap-2">
      <BanPickHeader />
      <BanPickBody />
    </div>
  );
}
