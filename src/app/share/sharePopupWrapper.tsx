import SharePopup from "./sharePopup";

function SharePopupWrapper({ setSharePopup, isShareOpen }: { setSharePopup: (b:boolean) => void; isShareOpen: boolean }) {
  //userId 발급
  const userId = `${Math.floor(Math.random() * 100000000)}`;
  if(!isShareOpen)return <></>
  return <SharePopup userId={userId} setSharePopup={setSharePopup} isShareOpen={isShareOpen} />;
}

// `true` 대신 `() => true`를 전달하여 함수형 조건으로 변경
export default SharePopupWrapper
