'use client';
import Image from 'next/image';
import React, { ReactEventHandler, useEffect, useState } from 'react';
interface PropType {
  src: string;
  width?: number | `${number}` | undefined;
  height?: number | `${number}` | undefined;
  alt?: string;
  onLoad?: ReactEventHandler<HTMLImageElement> | undefined;
  onError?: ReactEventHandler<HTMLImageElement> | undefined;
  className?: string | undefined;
  onClick?: ReactEventHandler<HTMLImageElement> | undefined;
}
const myLoader = () => {
  return `/images/default_champ.png`;
};
function ImageComp({
  src,
  width = 100,
  height = 100,
  alt = 'image',
  onLoad,
  onError,
  onClick,
  className = '',
}: PropType) {
  const [imageSrc, setImageSrc] = useState<string>(src);
  useEffect(() => setImageSrc(src), [src]);
  return (
    <>
      <Image
        src={imageSrc}
        width={width}
        height={height}
        alt={alt}
        placeholder="blur" 
        blurDataURL={'/images/default_champ.png'} // 로딩 전 보여줄 낮은 품질의 이미지
        onLoad={onLoad}
        onError={(e) => {
          setImageSrc('/images/default_champ.png');
          if (onError) onError(e);
        }}
        onClick={onClick}
        className={className}
        priority={true} // 즉시 로드
      />
    </>
  );
}

export default ImageComp;
