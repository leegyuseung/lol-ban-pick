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
    // const clientId = req.nextUrl.searchParams.get('roomId');
    const roomId = req.nextUrl.searchParams.get('roomId'); // 🔥 여기서 미리 가져옴
    const randomId = Math.random().toString(36).substr(2, 20)
    console.log(roomId, "::: roomId from params");


    if (!wss) {
      console.log(roomId,"::::")
      // return
      const clientId = roomId
        ? roomId as string
        : randomId;
      // const roomId = "test2"
      console.log(roomId,":::222")
      console.log('🛠️ WebSocket 서버 초기화...');
      wss = new WebSocketServer({ port: 3001 });

      wss.on('connection', (ws) => {
        console.log(ws,"더블")
        const clientRoomId = req?.url?.split('roomId=')[1] || Math.random().toString(36).substr(2, 20);
        console.log(`✅ 새로운 클라이언트 연결됨: ${clientRoomId}//////${req?.url}`);

        if(randomId == clientId){
          console.log("들어감")
          clients.push({ id: clientId, ws });
        }
        console.log(`✅ 새로운 클라이언트 연결됨: ${randomId!=clientId}///${clientId}//////${roomId})}random${randomId}`);

        ws.send(JSON.stringify({ type: 'id', id: clientId }));

        ws.on('message', (message: string) => {
          const data = JSON.parse(message);
          console.log('📩 받은 메시지:', data);

          // 특정 클라이언트에게 메시지 전송
          if (data.type === 'private') {
            const recipient = clients.filter((client) => client.id === data.to);
            // console.log(recipient,clients.filter((client) => client.id === data.to));
            if (recipient) {
              recipient.forEach(e=>e.ws.send(
                JSON.stringify({
                  type: 'private',
                  from: data.from, // 보낸 사람의 roomId
                  message: data.message,
                }),
              ))
            } else {
              console.warn(`⚠️ 대상 (${data.to})을 찾을 수 없음`);
              console.log(clients)
              clients.forEach((e) =>{
                console.log(e,"ee")
              })
              // clients.forEach((e) =>
              //   e.ws.send(
              //     JSON.stringify({
              //       type: 'private',
              //       from: data.from, // 보낸 사람의 roomId
              //       message: data.message,
              //     }),
              //   ),
              // );
            }
          }
        });

        ws.on('close', () => {
          clients = clients.filter((client) => client.ws !== ws);
          console.log(`❌ 클라이언트 연결 종료: ${clientId}`);
        });
      });
    }

    return NextResponse.json({ message: 'WebSocket server is running' });
  } catch (e) {
    console.log(e);
  }
}

export const runtime = 'nodejs'; // ✅ 최신 Next.js 규칙 적용
