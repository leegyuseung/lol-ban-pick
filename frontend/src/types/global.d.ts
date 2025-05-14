interface Window {
  kakao?: {
    adfit?: {
      load: () => void;
      destroy: (unit: string) => void; // 특정 광고 단위 제거
      refresh: (unit?: string) => void; // 전체/특정 광고 갱신
      display: (unit: string) => void;
    };
  };
}
