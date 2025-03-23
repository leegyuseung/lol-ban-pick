// components/YourClientSideComponent.tsx
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { usePopupStore } from '@/store';
const useRouterHook = () => {
  const { initPopupState } = usePopupStore();
  const pathName = usePathname();
  useEffect(() => {
    const initPopup = () => {
      console.log('라우트 변경:', pathName);
      initPopupState();
    };
    initPopup()
    console.log("부모")
  }, [pathName]);
};

export default useRouterHook;
