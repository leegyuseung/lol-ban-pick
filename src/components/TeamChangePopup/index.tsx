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
          <button onClick={onConfirm} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            예
          </button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-900 rounded-md hover:bg-gray-400">
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}
