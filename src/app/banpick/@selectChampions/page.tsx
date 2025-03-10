import Banpick from './selectChampionsArea';
import { ApiResponse } from '@/types/types';

async function fetchImages(): Promise<{ img: string }[]> {
  const res = await fetch('http://localhost:3000/api/banpick'); // API 호출
  const data: ApiResponse<{ img: string }[]> = await res.json();
  return data.result;
}

export default async function BanpickPage() {
  // 서버에서 데이터를 가져와 SSG로 제공
  // const images = await fetchImages();
  // champs={images}
  return <Banpick  />;
}
