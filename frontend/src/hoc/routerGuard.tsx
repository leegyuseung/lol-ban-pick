'use client';

import { useMemo } from 'react';
import { usePopupStore } from '@/store';

export function withNavigationGuard<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  condition: () => boolean,
) {
  return function ProtectedComponent(props: T) {
    const { initPopupState } = usePopupStore();

    // 🚀 가장 먼저 실행되도록 보장
    useMemo(() => {
      initPopupState();
    }, []);

    return condition() ? <WrappedComponent {...props} /> : null;
  };
}
