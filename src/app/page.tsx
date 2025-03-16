import Form from '@/components/FormRow';
import Header from '@/components/Header';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div>
      <div className="flex flex-col h-screen">
        <Header />
        <Suspense>
        <Form />
        </Suspense>
      </div>
    </div>
  );
}
