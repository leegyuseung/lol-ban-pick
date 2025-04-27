import { InfoType, RulesType } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';
import { WebSocketServer, WebSocket } from 'ws';



export async function GET() {
  try {
    // WebSocket 서버 URL
    const socketUrl = process.env.NEXT_PUBLIC_WS_URL;
    
    return NextResponse.json({ 
      socketUrl 
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
