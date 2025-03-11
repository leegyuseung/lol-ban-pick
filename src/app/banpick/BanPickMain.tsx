import BanPickBody from './(components)/BanPickBody';
import BanPickHeader from './(components)/BanPickHeader';

export default function BanPickMain() {
  return (
    <div className="flex flex-col h-screen gap-2">
      <BanPickHeader />
      <BanPickBody />
    </div>
  );
}
