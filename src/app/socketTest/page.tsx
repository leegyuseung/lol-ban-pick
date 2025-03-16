import SocketTestMain from './socketTestMain';
//socketTest 페이지
//userId 발급
function page({ userId: _userId }: { userId: string }) {
  const userId = `${Math.floor(Math.random() * 100000000)}`;
  return (
    <>
      <SocketTestMain userId={userId} />
    </>
  );
}

export default page;
