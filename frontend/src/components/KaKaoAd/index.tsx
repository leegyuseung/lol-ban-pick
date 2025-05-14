// KakaoAd.tsx
'use client';

import { useEffect, useRef } from 'react';

function KakaoAdLeft() {
  const adRefLeft = useRef<HTMLDivElement>(null);

  // 광고 리로딩이 필요한 경우 (예: 화면 크기 변경)
  useEffect(() => {
    const handleResize = () => {
      window.kakao?.adfit?.refresh();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !adRefLeft.current) return;

    // 1. 광고 컨테이너 초기화
    adRefLeft.current.innerHTML = '';

    // 2. 광고 영역 생성
    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.setAttribute('data-ad-unit', 'DAN-5Yz40Fvnu3lfzy0J');
    ins.setAttribute('data-ad-width', '160');
    ins.setAttribute('data-ad-height', '600');
    ins.style.display = 'block';
    adRefLeft.current.appendChild(ins);

    // 3. 스크립트 로딩 로직
    const existingScript = document.querySelector('script[src="https://t1.daumcdn.net/kas/static/ba.min.js"]');

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/kas/static/ba.min.js';
      script.async = true;

      script.onload = () => {
        window.kakao?.adfit?.load();
      };

      document.body.appendChild(script);
    } else {
      // 4. 스크립트가 이미 존재하면 수동으로 로드 호출
      window.kakao?.adfit?.load();
    }

    // 5. 컴포넌트 언마운트 시 정리
    return () => {
      window.kakao?.adfit?.destroy('DAN-5Yz40Fvnu3lfzy0J');
      existingScript?.remove();
    };
  }, []);

  return <div ref={adRefLeft} className="hidden md:block fixed left-5 top-28 w-[160px] h-[600px] z-50" />;
}
function KakaoAdRight() {
  const adRefRight = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      window.kakao?.adfit?.refresh('DAN-HMPeUA5opNCOFsS9');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !adRefRight.current) return;

    // 1. 광고 컨테이너 초기화
    adRefRight.current.innerHTML = '';

    // 2. 광고 영역 생성
    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.setAttribute('data-ad-unit', 'DAN-HMPeUA5opNCOFsS9');
    ins.setAttribute('data-ad-width', '160');
    ins.setAttribute('data-ad-height', '600');
    ins.style.display = 'block';
    adRefRight.current.appendChild(ins);

    // 3. 스크립트 로딩 처리
    const existingScript = document.querySelector('script[src="https://t1.daumcdn.net/kas/static/ba.min.js"]');

    const loadAd = () => {
      window.kakao?.adfit?.load();
      window.kakao?.adfit?.refresh('DAN-HMPeUA5opNCOFsS9');
    };

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/kas/static/ba.min.js';
      script.async = true;
      script.onload = loadAd;
      document.body.appendChild(script);
    } else {
      loadAd();
    }

    // 4. 컴포넌트 정리 로직
    return () => {
      window.kakao?.adfit?.destroy('DAN-HMPeUA5opNCOFsS9');
      existingScript?.remove();
    };
  }, []);

  return <div ref={adRefRight} className="hidden md:block fixed right-5 top-28 w-[160px] h-[600px] z-50" />;
}

function KakaoAdM() {
  const adRefM = useRef<HTMLDivElement>(null);
  const isScriptLoaded = useRef(false); // 스크립트 중복 로드 방지용

  useEffect(() => {
    if (typeof window === 'undefined' || !adRefM.current) return;

    // 1. 광고 영역 초기화
    adRefM.current.innerHTML = '';

    // 2. 광고 요소 생성 및 삽입
    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.setAttribute('data-ad-unit', 'DAN-hPPLQlwTLymhC5GO');
    ins.setAttribute('data-ad-width', '375');
    ins.setAttribute('data-ad-height', '50');
    ins.style.display = 'block';
    adRefM.current.appendChild(ins);

    // 3. 스크립트 동적 로드
    const handleAdLoad = () => {
      window.kakao?.adfit?.load();
      window.kakao?.adfit?.refresh('DAN-hPPLQlwTLymhC5GO');
    };

    const existingScript = document.querySelector('script[src="https://t1.daumcdn.net/kas/static/ba.min.js"]');

    if (!existingScript && !isScriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/kas/static/ba.min.js';
      script.async = true;
      script.onload = handleAdLoad;
      document.body.appendChild(script);
      isScriptLoaded.current = true;
    } else {
      handleAdLoad();
    }

    // 4. 화면 리사이즈 핸들러
    const resizeHandler = () => {
      window.kakao?.adfit?.refresh('DAN-hPPLQlwTLymhC5GO');
    };
    window.addEventListener('resize', resizeHandler);

    // 5. 클린업 함수
    return () => {
      window.removeEventListener('resize', resizeHandler);
      window.kakao?.adfit?.destroy('DAN-hPPLQlwTLymhC5GO');
      if (existingScript) existingScript.remove();
    };
  }, []);

  return <div ref={adRefM} className="md:hidden w-[375px] h-[50px] mt-3" />;
}

function KakaoAdIngame() {
  const adRefIngame = useRef<HTMLDivElement>(null);
  const isScriptLoaded = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !adRefIngame.current) return;

    // 1. 광고 영역 초기화
    adRefIngame.current.innerHTML = '';

    // 2. 광고 ins 태그 생성 및 삽입
    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.setAttribute('data-ad-unit', 'DAN-brjdAbDzay4oMlpW');
    ins.setAttribute('data-ad-width', '840');
    ins.setAttribute('data-ad-height', '90');
    ins.style.display = 'block';
    adRefIngame.current.appendChild(ins);

    // 3. 스크립트 로딩 및 광고 로드
    const handleAdLoad = () => {
      window.kakao?.adfit?.load();
      window.kakao?.adfit?.refresh('DAN-brjdAbDzay4oMlpW');
    };

    const existingScript = document.querySelector('script[src="https://t1.daumcdn.net/kas/static/ba.min.js"]');
    if (!existingScript && !isScriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/kas/static/ba.min.js';
      script.async = true;
      script.onload = handleAdLoad;
      document.body.appendChild(script);
      isScriptLoaded.current = true;
    } else {
      handleAdLoad();
    }

    // 4. 반응형 광고를 위한 리사이즈 핸들러
    const resizeHandler = () => {
      window.kakao?.adfit?.refresh('DAN-brjdAbDzay4oMlpW');
    };
    window.addEventListener('resize', resizeHandler);

    // 5. 언마운트 시 정리
    return () => {
      window.removeEventListener('resize', resizeHandler);
      window.kakao?.adfit?.destroy('DAN-brjdAbDzay4oMlpW');
      if (existingScript) existingScript.remove();
    };
  }, []);

  return <div ref={adRefIngame} className="hidden md:flex absolute left-1/4 bottom-2 w-[840px] h-[90px] z-50" />;
}

function KakaoAdWaiting() {
  const adRefWaiting = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !adRefWaiting.current || isMounted.current) return;
    isMounted.current = true;

    // 1. 광고 컨테이너 초기화
    adRefWaiting.current.innerHTML = '';

    // 2. 광고 요소 생성 및 삽입
    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.setAttribute('data-ad-unit', 'DAN-sERTPnH81BGojrA1');
    ins.setAttribute('data-ad-width', '728');
    ins.setAttribute('data-ad-height', '90');
    ins.style.display = 'block';
    adRefWaiting.current.appendChild(ins);

    // 3. 스크립트 로딩 전략
    const handleAdLoad = () => {
      window.kakao?.adfit?.load();
      window.kakao?.adfit?.refresh('DAN-sERTPnH81BGojrA1');
    };

    const existingScript = document.querySelector('script[src="https://t1.daumcdn.net/kas/static/ba.min.js"]');

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/kas/static/ba.min.js';
      script.async = true;
      script.onload = handleAdLoad;
      document.body.appendChild(script);
    } else {
      // 4. 이미 스크립트가 로드된 경우 즉시 실행
      handleAdLoad();
    }

    // 5. 반응형 대응 이벤트 핸들러
    const resizeObserver = new ResizeObserver(() => {
      window.kakao?.adfit?.refresh('DAN-sERTPnH81BGojrA1');
    });

    if (adRefWaiting.current) {
      resizeObserver.observe(adRefWaiting.current);
    }

    // 6. 클린업 함수
    return () => {
      resizeObserver.disconnect();
      window.kakao?.adfit?.destroy('DAN-sERTPnH81BGojrA1');
      existingScript?.remove();
      isMounted.current = false;
    };
  }, []);

  return <div ref={adRefWaiting} className="hidden mt-7 md:flex w-[728px] h-[90px] z-50" />;
}

export { KakaoAdRight, KakaoAdLeft, KakaoAdM, KakaoAdIngame, KakaoAdWaiting };
