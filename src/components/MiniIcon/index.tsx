import React from 'react';
import Image from 'next/image';

interface MiniIconProps {
  className: string;
  src: string;
  width: number;
  height: number;
  alt?: string;
  onClick?: () => void;
}

const MiniIcon = React.memo(({ className, src, width, height, alt = '', onClick }: MiniIconProps) => {
  return <Image className={className} src={src} alt={alt} width={width} height={height} onClick={onClick} />;
});

MiniIcon.displayName = 'MiniIcon';

export default MiniIcon;
