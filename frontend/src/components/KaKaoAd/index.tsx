// KakaoAd.tsx
'use client';

import { useEffect, useRef } from 'react';

function KakaoAdLeft() {
  const adRefLeft = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && adRefLeft.current) {
      const ins = document.createElement('ins');
      ins.className = 'kakao_ad_area';
      ins.setAttribute('data-ad-unit', 'DAN-5Yz40Fvnu3lfzy0J');
      ins.setAttribute('data-ad-width', '160');
      ins.setAttribute('data-ad-height', '600');
      ins.style.display = 'block';
      adRefLeft.current.appendChild(ins);

      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.kakao && window.kakao.adfit) {
          window.kakao.adfit.load();
        }
      };
    }
  }, []);

  return <div ref={adRefLeft} className="fixed left-5 top-28 w-[160px] h-[600px] z-50" />;
}

function KakaoAdRight() {
  const adRefRight = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && adRefRight.current) {
      const ins = document.createElement('ins');
      ins.className = 'kakao_ad_area';
      ins.setAttribute('data-ad-unit', 'DAN-HMPeUA5opNCOFsS9');
      ins.setAttribute('data-ad-width', '160');
      ins.setAttribute('data-ad-height', '600');
      ins.style.display = 'block';
      adRefRight.current.appendChild(ins);

      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.kakao && window.kakao.adfit) {
          window.kakao.adfit.load();
        }
      };
    }
  }, []);

  return <div ref={adRefRight} className="fixed right-5 top-28 w-[160px] h-[600px] z-50" />;
}

export { KakaoAdRight, KakaoAdLeft };
