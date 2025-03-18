import Image from 'next/image';

interface PropsI {
  closePopup: () => void;
  selectedTeamColor: string;
  blueImage: string;
  redImage: string;
  setBlueImage: React.Dispatch<React.SetStateAction<string>>;
  setRedImage: React.Dispatch<React.SetStateAction<string>>;
}

export default function TeamLogoPopup({
  selectedTeamColor,
  closePopup,
  setBlueImage,
  setRedImage,
  blueImage,
  redImage,
}: PropsI) {
  const ImageList = ['t1', 'hanwha', 'geng', 'kia', 'kt', 'dn', 'drx', 'ns', 'ok'];

  const selectImage = (url: string) => {
    if (selectedTeamColor === 'blue') {
      setBlueImage(url);
    } else {
      setRedImage(url);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
      <div className="flex flex-col justify-center items-center bg-mainBlack rounded-lg w-[1100px] h-[200px] gap-5">
        <div className="flex gap-10">
          {Array.from({ length: ImageList.length }).map((_, index) => {
            const imageUrl = `/images/${ImageList[index]}.webp`;
            return (
              <div className="relative w-[80px] h-[80px]" key={index}>
                <Image
                  src={imageUrl}
                  alt={`${ImageList[index]}`}
                  fill
                  sizes="w-[80px] h-[80px]"
                  priority
                  className={`object-contain cursor-pointer border-2 
                    ${
                      selectedTeamColor === 'blue'
                        ? blueImage === imageUrl
                          ? 'border-blue-500'
                          : 'border-transparent'
                        : redImage === imageUrl
                          ? 'border-red-500'
                          : 'border-transparent'
                    }`}
                  onClick={() => selectImage(imageUrl)}
                />
              </div>
            );
          })}
        </div>

        <button
          className="font-semibold w-[200px] p-3 border border-mainText text-mainText rounded-md hover:bg-gray-500 transition"
          onClick={closePopup}
        >
          선택
        </button>
      </div>
    </div>
  );
}
