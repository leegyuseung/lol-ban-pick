import { Metadata } from 'next';
import { images } from '@/constants';
import AboutMain from '@/app/about/AboutMain';

export const metadata: Metadata = {
  title: 'MetaPick(메타픽) - 정보',
  description: '개발자 정보와 업데이트 내역을 확인하세요.',
  openGraph: {
    title: 'MetaPick(메타픽) - 정보',
    description: '개발자 정보와 업데이트 내역을 확인하세요.',
    images: [images.THUMBNAIL],
    url: `${process.env.NEXT_PUBLIC_URL}/about`,
    type: 'website',
    siteName: 'MetaPick(메타픽)',
  },
};

function About() {
  return (
    <>
      <AboutMain />
    </>
  );
}

export default About;
