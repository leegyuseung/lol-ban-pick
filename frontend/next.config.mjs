const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://ep2.adtrafficquality.google 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' https://ddragon.leagueoflegends.com https://avatars.githubusercontent.com https://pagead2.googlesyndication.com data:;
  font-src 'self';
  connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com https://www.googletagmanager.com https://ep1.adtrafficquality.google wss://ws.metapick.site;
  frame-src https://*.google.com https://*.googlesyndication.com https://googleads.g.doubleclick.net;
  form-action 'self';
  object-src 'none';
`
  .replace(/\s{2,}/g, ' ')
  .trim();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy,
          },
        ],
      },
    ];
  },
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
