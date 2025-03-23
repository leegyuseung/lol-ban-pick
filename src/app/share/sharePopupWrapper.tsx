import SharePopup from "./sharePopup";

function SharePopupWrapper({ closePopup, isOpen }: { closePopup: () => void; isOpen: boolean }) {
  //userId 발급
  const userId = `${Math.floor(Math.random() * 100000000)}`;
  if(!isOpen)return <></>
  return <SharePopup userId={userId} closePopup={closePopup} isOpen={isOpen} />;
}

// `true` 대신 `() => true`를 전달하여 함수형 조건으로 변경
export default SharePopupWrapper
