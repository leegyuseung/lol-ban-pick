import Image from 'next/image';
import React from 'react';
interface PropType {
  src: string;
  width?: number | `${number}` | undefined;
  height?: number | `${number}` | undefined;
  alt?: string;
}
function ImageComp({ src, width = 100, height = 100, alt = "image" }: PropType) {
  return <Image src={src} width={width} height={height} alt={alt} />;
}

export default ImageComp;
