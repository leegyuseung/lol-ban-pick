/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.banpick.kr',], // 외부 이미지 도메인 추가
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
