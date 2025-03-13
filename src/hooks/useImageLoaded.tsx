
import { useLayoutEffect } from 'react';
import { useBanpickStore } from '@/store';
function useImageLoaded() {
  const { championInfo, setChampionInfo } = useBanpickStore();
  useLayoutEffect(() => {
    //이미지 미리 로드
    const hoverImgPreload = (src: string) => {
      const img = new window.Image();
      img.src = src;
    };
    if (!Object.keys(championInfo).length) {
      setChampionInfo();
    } else {
      Object.entries(championInfo).map(([name, info]) =>
        hoverImgPreload(`https://ddragon.leagueoflegends.com/cdn/${info.version}/img/champion/${name}.png`),
      );
    }
  }, [championInfo]);
}

export default useImageLoaded;
