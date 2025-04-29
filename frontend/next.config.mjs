/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@common/constants'],
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'metapick.site',
      },
      {
        protocol: 'https',
        hostname: '52.79.193.184',
      },
      {
        protocol: 'https',
        hostname: 'ddragon.leagueoflegends.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;
