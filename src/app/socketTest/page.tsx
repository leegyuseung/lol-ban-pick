import BanpickSocket from './banpickSocket';
//socketTest 페이지
function BanpickSocketWrapper({ userId: _userId }: { userId: string }) {
  //userId 발급
  const userId = `${Math.floor(Math.random() * 100000000)}`;
  return (
    <>
      <BanpickSocket userId={userId} />
    </>
  );
}

export default BanpickSocketWrapper;
