// app/api/getapi/route.ts
import { NextResponse } from 'next/server';
import images from '@/mock/champs.json';
import { ApiResponse } from '@/types/types';

export async function GET() {
  const response: ApiResponse<typeof images> = {
    result_code: 200,
    result: images,
    message: '성공',
  };

  return NextResponse.json(response);
}
