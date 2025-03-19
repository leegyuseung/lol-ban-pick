import SharePopup from './sharePopup';
//socketTest 페이지
function SharePopupWrapper({ closePopup }: { closePopup: () => void }) {
  //userId 발급
  const userId = `${Math.floor(Math.random() * 100000000)}`;
  console.log(userId)
  return (
    <>
      <SharePopup userId={userId} closePopup={closePopup} />
    </>
  );
}

export default SharePopupWrapper;
