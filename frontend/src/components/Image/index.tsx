'use client';
import Image from 'next/image';
import { DebouncedFuncLeading, throttle } from 'lodash';
import { MutableRefObject } from 'react';
import React, { ReactEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
interface PropType {
  src: string;
  width?: number | `${number}` | undefined;
  height?: number | `${number}` | undefined;
  alt?: string;
  onLoad?: ReactEventHandler<HTMLImageElement> | undefined;
  onError?: ReactEventHandler<HTMLImageElement> | undefined;
  className?: string | undefined;
  onClick?: ReactEventHandler<HTMLImageElement> | undefined;
  priority?: boolean;
  onMouseOver?: ReactEventHandler<HTMLImageElement> | undefined;
  throttlingTime?: number;
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
  priority = true,
  className = '',
  onMouseOver,
  throttlingTime = 0,
}: PropType) {
  const [imageSrc, setImageSrc] = useState<string>(src);
  useEffect(() => setImageSrc(src), [src]);
  const throttledRef = useRef<((...args: any[]) => void) | null>(null);
  // ✅ 처음 한 번만 throttle 함수 생성
  useEffect(() => {
    if (onClick) {
      throttledRef.current = throttle(onClick, throttlingTime);
    } else {
      throttledRef.current = null;
    }
  }, [onClick, throttlingTime]);

  // ✅ 클릭할 때는 ref에 있는 throttled 함수만 실행
  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    console.log(throttledRef);
    throttledRef.current?.(e);
  };

  return (
    <>
      <Image
        src={imageSrc}
        width={width}
        height={height}
        alt={alt}
        placeholder="blur"
        loading="eager" // 바로 로드
        onMouseOver={onMouseOver}
        blurDataURL={'/images/default_champ.png'} // 로딩 전 보여줄 낮은 품질의 이미지
        onLoad={onLoad}
        onError={(e) => {
          setImageSrc('/images/default_champ.png');
          if (onError) onError(e);
        }}
        onClick={handleClick}
        className={className}
        priority={true} // 즉시 로드
      />
    </>
  );
}

export default ImageComp;
