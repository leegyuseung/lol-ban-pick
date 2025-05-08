'use client';

import Image from 'next/image';
import update from '@/data/updates.json';
import developer from '@/data/developer.json';
import { useState } from 'react';

export default function About() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // 어떤 항목 열려있는지

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index); // 다시 누르면 닫힘
  };

  return (
    <main className="flex flex-col flex-grow items-center justify-center bg-mainBlack text-white space-y-12 mt-5 pt-16 md:mt-20">
      {/* 공지사항 */}
      <section className="w-3/4 max-w-2xl">
        <h2 className="text-sm md:text-xl font-bold mb-4 border-b pb-2">☑️ 업데이트</h2>
        <ul className="space-y-2">
          {update.updates.map((update, index) => (
            <li key={index} className="border-b border-gray-700 pb-2">
              <button
                onClick={() => handleToggle(index)}
                className="flex justify-between w-full text-left pointerhover:hover:text-gray-400 text-sm md:text-base"
              >
                <span>{update.title}</span>
                <span className="text-gray-400 text-[10px] md:text-base">{update.date}</span>
              </button>
              {openIndex === index && <p className="mt-2 text-gray-300 text-xs md:text-sm">{update.content}</p>}
            </li>
          ))}
        </ul>
      </section>

      {/* 개발자 소개 */}
      <section className="w-3/4 max-w-2xl">
        <h3 className="text-sm md:text-xl font-bold mb-4 border-b pb-2">🧑🏻‍💻 개발자</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {developer.developers.map((dev, index) => (
            <div key={index} className="flex flex-col items-center p-4 border border-gray-700 rounded-lg">
              <div className="hidden md:flex w-16 h-16 bg-gray-600 rounded-full mb-2">
                <Image alt="" src={dev.img} width={64} height={64} className="rounded-full object-cover" />
              </div>
              {/* 프로필 이미지 자리 */}
              <h3 className="text-sm md:text-base font-medium">{dev.name}</h3>
              <p className="text-xs md:text-base text-gray-400">{dev.role}</p>
              <a
                href={`mailto:${dev.email}`}
                className="text-blue-400 mt-2 text-xs md:text-sm pointerhover:hover:underline"
              >
                {dev.email}
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={dev.github}
                className="text-blue-400 mt-2 text-xs md:text-sm hover:underline"
              >
                Github
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
