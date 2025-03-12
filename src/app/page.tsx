import Form from '@/components/FormRow/index2';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div>
      <div className="flex flex-col h-screen">
        <Header />
        <Form />
      </div>
    </div>
  );
}
