import { NextRequest, NextResponse } from 'next/server';
import { WebSocketServer, WebSocket } from 'ws';

interface Client {
  userId: string;
  roomId: string;
  ws: WebSocket;
}

let wss: WebSocketServer | null = null;
let clients: Client[] = [];

export async function GET(req: NextRequest) {
  try {

    if (!wss) {
      console.log('🛠️ WebSocket 서버 초기화...');
      wss = new WebSocketServer({ port: 3001 });

      wss.on('connection', (ws, req) => {
        const urlParams = new URLSearchParams(req.url?.split('?')[1]);
        //room id
        const roomId = urlParams.get('roomId') as string
        //user id
        const userId = urlParams.get('userId') as string
        //room id와 user id 가 있고
        //room id와 user id가 둘다 없는 소켓상태
        if (roomId && userId && !clients.find((w) => w.roomId == roomId && w.userId == userId)) {
          clients.push({ userId, roomId, ws });
        }

        ws.on('message', (message: string) => {
          const data = JSON.parse(message);
          console.log('📩 받은 메시지:', data);

          // 특정 클라이언트에게 메시지 전송
          //이벤트는 추후 변경 예정
          if (data.type === 'private') {
            const recipient = clients.filter((client) => client.roomId === data.roomId);
            
            if (recipient) {
              recipient.forEach((e) =>
                e.ws.send(
                  JSON.stringify({
                    type: 'private',
                    roomId,
                    userId,
                    message: data.message,
                  }),
                ),
              );
            } else {
              console.warn(`⚠️ 대상 (${data.to})을 찾을 수 없음`);
              console.log(clients);
              clients.forEach((e) => {
                console.log(e, 'ee');
              });
            }
          }
        });

        ws.on('close', () => {
          clients = clients.filter((client) => client.ws !== ws);
          console.log(`❌ 클라이언트 연결 종료: ${roomId}`);
        });
      });
    }

    return NextResponse.json({ message: 'WebSocket server is running' });
  } catch (e) {
    console.log(e);
  }
}

export const runtime = 'nodejs'; 
