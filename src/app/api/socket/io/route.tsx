import { NextRequest, NextResponse } from 'next/server';
import { WebSocketServer, WebSocket } from 'ws';

interface Client {
  id: string;
  ws: WebSocket;
}

let wss: WebSocketServer | null = null;
let clients: Client[] = [];

export async function GET(req: NextRequest) {
  try {
    // const roomId = req.nextUrl.searchParams.get('roomId');
    
    const roomId = "test3"

    if (!wss && roomId) {
      console.log('🛠️ WebSocket 서버 초기화...');
      wss = new WebSocketServer({ port: 3001 });

      wss.on('connection', (ws) => {
        const clientRoomId = roomId;  // 클라이언트가 가진 roomId
        if(clients.findIndex((client) => client.id === roomId)<=-1){

            clients.push({ id: clientRoomId, ws });
        }
        console.log(`✅ 새로운 클라이언트 연결됨: ${clientRoomId}`);
      
        ws.send(JSON.stringify({ type: 'id', id: clientRoomId }));
      
        ws.on('message', (message: string) => {
          const data = JSON.parse(message);
          console.log('📩 받은 메시지:', data);
      
          // 특정 클라이언트에게 메시지 전송
          if (data.type === 'private') {
            console.log(clients);
            const recipient = clients.find((client) => client.id === data.to);  // 대상 클라이언트를 찾음
            if (recipient) {
              recipient.ws.send(
                JSON.stringify({
                  type: 'private',
                  from: clientRoomId,  // 보낸 사람의 roomId
                  message: data.message,
                })
              );
            } else {
              console.warn(`⚠️ 대상 (${data.to})을 찾을 수 없음`);
            }
          }
        });
      
        ws.on('close', () => {
          clients = clients.filter((client) => client.ws !== ws);
          console.log(`❌ 클라이언트 연결 종료: ${clientRoomId}`);
        });
      });
    }

    return NextResponse.json({ message: 'WebSocket server is running' });
  } catch (e) {
    console.log(e);
  }
}

export const runtime = 'nodejs'; // ✅ 최신 Next.js 규칙 적용
