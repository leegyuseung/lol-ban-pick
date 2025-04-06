'use client'
import Link from "next/link";

export default function Error() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-6xl font-bold text-mainGold">500</h1>
        <p className="text-xl text-gray-700 mb-6">서버 에러가 발생했습니다.</p>
        <Link href="/" className="text-blue-500 hover:underline text-lg">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
