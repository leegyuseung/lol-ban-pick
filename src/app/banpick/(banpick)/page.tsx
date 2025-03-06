import ImageComp from "@/components/Image/Images";

interface PropType {
  row?: number;
  col?: number;
}

function Banpick({ row = 5, col = 5 }: PropType) {
  // 0부터 999까지 숫자를 포함하는 배열 생성
  const arr: number[] = Array.from({ length: 1000 })

  return (
    <div className="w-xl h-xl bg-red-50">
      밴픽영역입니다
    </div>
  );
}

export default Banpick;
