// app/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // 일단 벤픽페이지로
  debugger
  return NextResponse.redirect(new URL('/banpick', req.url));
}

// // 미들웨어가 적용될 경로 설정
export const config = {
  matcher: ['/'],
};
