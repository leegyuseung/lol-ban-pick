'use client';
import ImageComp from '@/components/Image';
import { useEffect, useState } from 'react';

interface PropType {
  champs: {
    img: string;
  }[]; // champs는 Champ 배열
}

export default function Banpick({ champs }: PropType) {
  // 1000개 아이템을 표시하기 위해 배열 생성
  const [type, setType] = useState('static');
  const [loadTime, setLoadTime] = useState<number | null>(null); // 로딩 시간
  const [loadedImages, setLoadedImages] = useState<number>(0); // 로딩 완료된 이미지 개수
  const handleImageLoad = () => {
    setLoadedImages((prev) => prev + 1);
  };
  const handleImageError = () => {
    setLoadedImages((prev) => prev + 1); // 실패한 경우에도 로딩 완료로 처리
  };
  useEffect(() => {
    const startTime = performance.now(); // 로딩 시작 시간


    // 모든 이미지가 로드되면 소요 시간 계산
    if (loadedImages === champs.length) {
      const endTime = performance.now(); // 로딩 완료 시간
      setLoadTime(endTime - startTime); // 소요 시간 계산
    }

    return () => {
      // 컴포넌트가 unmount 될 때 clean up
      setLoadedImages(0);
    };
  }, [loadedImages, champs.length]);
  const changeType = () => {
    setType(type === 'static' ? 'url' : 'static');
  };

  return (
    <div className="w-xl h-xl bg-red-50">
      <button onClick={changeType}>로드 방식 변경{type}</button>
      loadTime : {loadTime+"????"+champs.length}
      {type === 'static'
        ? Array.from({ length: champs.length }).map((_, i: number) => (
            <ImageComp
              key={i}
              src={`/temp/sample_images_${i < 10 ? '0' + i : i}.png`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ))
        : champs.map((champ, index) => (
            <ImageComp key={index} src={champ.img} onLoad={handleImageLoad} onError={handleImageError} />
          ))}
    </div>
  );
}
