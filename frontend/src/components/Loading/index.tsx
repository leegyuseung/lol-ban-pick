'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Loading() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900">
      <div className="flex flex-col items-center space-y-6">
        {/* 블루 팀 로딩 애니메이션 */}
        <div className="flex space-x-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={`blue-${i}`}
              className="w-5 h-5 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>

        {/* 레드 팀 로딩 애니메이션 */}
        <div className="flex space-x-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={`red-${i}`}
              className="w-5 h-5 bg-red-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
