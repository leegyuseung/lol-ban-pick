import Form from '@/components/FormRow';
import Header from '@/components/Header';
import { Suspense } from 'react';
import SocketExit from './socketTest/socketExit';

export default function Home() {
  return (
    <div>
      <div className="flex flex-col h-screen">
        <Header />
        <Suspense>
        <Form />
        </Suspense>
        {/* 개선 예정 */}
        {/* <SocketExit/> */}
      </div>
    </div>
  );
}
