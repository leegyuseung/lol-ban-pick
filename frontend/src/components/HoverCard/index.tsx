'use client';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

type PropsType = {
  children: React.ReactNode;
  message: string;
  contentClass?: string;
  sideOffset?: number;
  alignOffset?: number;
  side?: 'right' | 'top' | 'bottom' | 'left';
  align?: 'center' | 'end' | 'start';
};

export default function HoverCards({
  children,
  message,
  alignOffset = 0,
  sideOffset = 0,
  contentClass = '',
  side = 'right',
  align = 'center',
}: PropsType) {
  return (
    <HoverCard openDelay={200} closeDelay={200}>
      <HoverCardTrigger className="md:flex hidden" asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={contentClass}
        side={side}
      >
        {message}
      </HoverCardContent>
    </HoverCard>
  );
}
