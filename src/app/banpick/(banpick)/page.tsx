// app/banpick/page.tsx
import ImageComp from '@/components/Image/Image';
import { ApiResponse } from '@/types/types';

// `fetchImages` 함수 정의
async function fetchImages(): Promise<{ img: string }[]> {
  const res = await fetch('http://localhost:3000/api/banpick');  // API 호출
  const data: ApiResponse<{ img: string }[]> = await res.json();  // 응답 타입 처리
  return data.result;  // 반환값
}

export default async function Banpick() {
  // 서버에서 fetchImages를 호출하여 이미지 리스트 가져오기
  const images = await fetchImages();

  // 1000개 아이템을 표시하기 위해 배열 생성
  const arr: number[] = Array.from({ length: 1000 });

  return (
    <div className="w-xl h-xl bg-red-50">
      {arr.map((_, index) => (
        <ImageComp key={index} src={images[index % images.length].img} />
      ))}
    </div>
  );
}
