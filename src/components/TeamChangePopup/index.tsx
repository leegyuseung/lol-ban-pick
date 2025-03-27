interface TeamChangePopupProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function TeamChangePopup({ onConfirm, onCancel }: TeamChangePopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-mainBlack p-6 rounded-lg w-[300px] text-center">
        <p className="text-lg font-semibold text-mainText">팀을 변경하시겠습니까?</p>
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="cursor-pointer h-8 px-8 bg-mainGold font-medium text-white rounded-sm hover:bg-opacity-65"
          >
            예
          </button>
          <button
            onClick={onCancel}
            className="cursor-pointer h-8 px-8 bg-gray-300 font-medium text-gray-900 rounded-sm hover:bg-opacity-65"
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}
