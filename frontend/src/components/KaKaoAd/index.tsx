// KakaoAd.tsx
'use client';

import { useEffect, useRef } from 'react';

function KakaoAdLeft() {
  const adRefLeft = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && adRefLeft.current) {
      // 광고 영역 생성
      const ins = document.createElement('ins');
      ins.className = 'kakao_ad_area';
      ins.setAttribute('data-ad-unit', 'DAN-5Yz40Fvnu3lfzy0J');
      ins.setAttribute('data-ad-width', '160');
      ins.setAttribute('data-ad-height', '600');
      ins.style.display = 'block';

      // 기존 광고가 있으면 삭제
      if (adRefLeft.current.firstChild) {
        adRefLeft.current.removeChild(adRefLeft.current.firstChild);
      }

      adRefLeft.current.appendChild(ins);

      // 스크립트 중복 로딩 방지
      if (!document.querySelector('script[src="//t1.daumcdn.net/kas/static/ba.min.js"]')) {
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          window.kakao?.adfit?.load();
        };
      } else {
        window.kakao?.adfit?.load();
      }
    }
  }, []);

  return <div ref={adRefLeft} className="hidden md:block fixed left-5 top-28 w-[160px] h-[600px] z-50" />;
}

function KakaoAdRight() {
  const adRefRight = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && adRefRight.current) {
      // 광고 영역 생성
      const ins = document.createElement('ins');
      ins.className = 'kakao_ad_area';
      ins.setAttribute('data-ad-unit', 'DAN-HMPeUA5opNCOFsS9');
      ins.setAttribute('data-ad-width', '160');
      ins.setAttribute('data-ad-height', '600');
      ins.style.display = 'block';

      // 기존 광고가 있으면 삭제
      if (adRefRight.current.firstChild) {
        adRefRight.current.removeChild(adRefRight.current.firstChild);
      }

      adRefRight.current.appendChild(ins);

      // 스크립트가 이미 로딩되어 있으면 다시 로딩하지 않음
      if (!document.querySelector('script[src="//t1.daumcdn.net/kas/static/ba.min.js"]')) {
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          window.kakao?.adfit?.load();
        };
      } else {
        window.kakao?.adfit?.load();
      }
    }
  }, []);

  return <div ref={adRefRight} className="hidden md:block fixed right-5 top-28 w-[160px] h-[600px] z-50" />;
}

function KakaoAdM() {
  const adRefM = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && adRefM.current) {
      // 광고 영역 생성
      const ins = document.createElement('ins');
      ins.className = 'kakao_ad_area';
      ins.setAttribute('data-ad-unit', 'DAN-hPPLQlwTLymhC5GO');
      ins.setAttribute('data-ad-width', '375');
      ins.setAttribute('data-ad-height', '50');
      ins.style.display = 'block';

      // 기존 광고가 있으면 삭제
      if (adRefM.current.firstChild) {
        adRefM.current.removeChild(adRefM.current.firstChild);
      }

      adRefM.current.appendChild(ins);

      // 스크립트 중복 로딩 방지
      if (!document.querySelector('script[src="//t1.daumcdn.net/kas/static/ba.min.js"]')) {
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          window.kakao?.adfit?.load();
        };
      } else {
        window.kakao?.adfit?.load();
      }
    }
  }, []);

  return <div ref={adRefM} className="md:hidden w-[375px] h-[50px] mt-3" />;
}

function KakaoAdIngame() {
  const adRefIngame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && adRefIngame.current) {
      // 광고 영역 생성
      const ins = document.createElement('ins');
      ins.className = 'kakao_ad_area';
      ins.setAttribute('data-ad-unit', 'DAN-brjdAbDzay4oMlpW');
      ins.setAttribute('data-ad-width', '840');
      ins.setAttribute('data-ad-height', '90');
      ins.style.display = 'block';

      // 기존 광고가 있으면 삭제
      if (adRefIngame.current.firstChild) {
        adRefIngame.current.removeChild(adRefIngame.current.firstChild);
      }

      adRefIngame.current.appendChild(ins);

      // 스크립트 중복 로딩 방지
      if (!document.querySelector('script[src="//t1.daumcdn.net/kas/static/ba.min.js"]')) {
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          window.kakao?.adfit?.load();
        };
      } else {
        window.kakao?.adfit?.load();
      }
    }
  }, []);

  return <div ref={adRefIngame} className="hidden md:flex absolute left-1/4 bottom-2 w-[840px] h-[90px] z-50" />;
}

function KakaoAdWaiting() {
  const adRefWaiting = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && adRefWaiting.current) {
      // 광고 영역 생성
      const ins = document.createElement('ins');
      ins.className = 'kakao_ad_area';
      ins.setAttribute('data-ad-unit', 'DAN-sERTPnH81BGojrA1');
      ins.setAttribute('data-ad-width', '728');
      ins.setAttribute('data-ad-height', '90');
      ins.style.display = 'block';

      // 기존 광고가 있으면 삭제
      if (adRefWaiting.current.firstChild) {
        adRefWaiting.current.removeChild(adRefWaiting.current.firstChild);
      }

      adRefWaiting.current.appendChild(ins);

      // 스크립트 중복 로딩 방지
      if (!document.querySelector('script[src="//t1.daumcdn.net/kas/static/ba.min.js"]')) {
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          window.kakao?.adfit?.load();
        };
      } else {
        window.kakao?.adfit?.load();
      }
    }
  }, []);

  return <div ref={adRefWaiting} className="hidden mt-7 md:flex w-[728px] h-[90px] z-50" />;
}

export { KakaoAdRight, KakaoAdLeft, KakaoAdM, KakaoAdIngame, KakaoAdWaiting };
