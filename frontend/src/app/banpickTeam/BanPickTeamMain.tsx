import BanPickBody from '@/app/banpickTeam/(components)/BanPickBodyTeam';
import BanPickHeader from '@/app/banpickTeam/(components)/BanPickHeaderTeam';

export default function BanPickMain() {
  return (
    <div className="flex flex-col h-screen gap-2">
      <BanPickHeader />
      <BanPickBody />
    </div>
  );
}
