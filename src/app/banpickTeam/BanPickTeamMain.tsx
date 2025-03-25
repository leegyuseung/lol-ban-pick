import BanPickBody from './(components)/BanPickBodyTeam';
import BanPickHeader from './(components)/BanPickHeaderTeam';

export default function BanPickMain() {
  return (
    <div className="flex flex-col h-screen gap-2">
      <BanPickHeader />
      <BanPickBody />
    </div>
  );
}
