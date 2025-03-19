import BanpickSocket from '@/app/socketTest/banpickSocket';
import BanPickMain from './BanPickMain';
function Banpick() {
  const userId = `${Math.floor(Math.random() * 100000000)}`;
  return (
    <>
      {/* <BanpickSocket userId={userId}></BanpickSocket> */}
      <BanPickMain />;
    </>
  );
}

export default Banpick;
