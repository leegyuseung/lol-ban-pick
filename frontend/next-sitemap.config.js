
require('dotenv').config(); // 환경 변수 로드
/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.NEXT_PUBLIC_URL,
  generateRobotsTxt: true,
  sitemapSize: 7000,
};

module.exports = config;
