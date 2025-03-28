import { InfoType, RulesType } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';
import { WebSocketServer, WebSocket } from 'ws';
interface Client extends RulesType {
  userId: string;
  roomId: string;
  ws: WebSocket;
  host: boolean;
  position?: 'blue' | 'red' | 'audience' | undefined;
  role: 'host' | 'guest' | 'audience';
  hostInfo: InfoType | { status: '' };
  guestInfo: InfoType | { status: '' };
  audienceCount: number;
  status: 'join' | 'ready' | '';
}

type InitClient = Pick<Client, 'userId' | 'roomId' | 'ws' | 'host' | 'position' | 'role' | 'hostInfo' | 'guestInfo'>;

const clients: (Client | InitClient)[] = [];
const globalForWs = global as unknown as { wss?: WebSocketServer; clients: (Client | InitClient)[] };

export async function GET() {
  try {
    // WebSocket 서버 URL
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    
    return NextResponse.json({ 
      wsUrl 
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
