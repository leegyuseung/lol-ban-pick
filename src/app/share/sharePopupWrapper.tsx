import SharePopup from './sharePopup';
//socketTest 페이지
function SharePopupWrapper({ closePopup, isOpen }: { closePopup: () => void; isOpen: boolean }) {
  //userId 발급
  const userId = `${Math.floor(Math.random() * 100000000)}`;
  return (
    <>
      <SharePopup userId={userId} closePopup={closePopup} isOpen={isOpen} />
    </>
  );
}

export default SharePopupWrapper;
