export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
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

        {/* 로딩 텍스트 */}
        <p className="text-lg text-white font-bold tracking-wide animate-pulse">
          로딩 중...
        </p>

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
    </div>
  );
}
