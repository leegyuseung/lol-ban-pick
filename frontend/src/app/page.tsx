import Form from '@/components/FormRow';
import { images } from '@/constants';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'MetaPick(메타픽) - 리그오브레전드(롤) 밴픽 시뮬레이터',
  keywords: [
    '밴픽',
    '시뮬레이터',
    '롤 밴픽',
    'MetaPick',
    'League of Legends',
    '메타픽',
    '드리프트 토너먼트',
    '드리프트',
    '토너먼트',
    '피어리스',
    '피어리스 밴픽',
    '피어리스밴픽',
    '밴픽 시뮬레이터',
    '밴픽시뮬',
    '롤',
    '롤 피어리스',
  ],
  description:
    '리그오브레전드의 밴픽을 자유롭게 시뮬레이션할 수 있는 MetaPick! 토너먼트 드리프트, 피어리스 등 다양한 밴픽 모드와 솔로, 팀을 설정하는 참여 모드를 이용하세요',
  openGraph: {
    title: 'MetaPick(메타픽) - 리그오브레전드(롤) 밴픽 시뮬레이터',
    description:
      '리그오브레전드의 밴픽을 자유롭게 시뮬레이션할 수 있는 MetaPick! 토너먼트 드리프트, 피어리스 등 다양한 밴픽 모드와 솔로, 팀을 설정하는 참여 모드를 이용하세요',
    images: [images.THUMBNAIL],
    url: process.env.NEXT_PUBLIC_URL,
    type: 'website',
    siteName: 'MetaPick(메타픽)',
  },
};

export default function Home() {
  return (
    <div className="flex flex-col">
      <Suspense>
        <Form />
      </Suspense>
    </div>
  );
}
