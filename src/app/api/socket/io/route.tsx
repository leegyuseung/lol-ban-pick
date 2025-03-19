import { NextRequest, NextResponse } from 'next/server';
import { WebSocketServer, WebSocket } from 'ws';

interface Client {
  userId: string;
  roomId: string;
  ws: WebSocket;
  side: string;
  host: boolean;
  rules: {
    myTeamSide: 'blue' | 'red' | 'audience' | undefined; //undefined일때 host

    myTeam?: string;
    yourTeam?: string;
    banpickMode?: 'tournament' | 'peerless3' | 'peerless5';
    peopleMode?: 'solo' | 'team';
    timeUnlimited?: 'true' | 'false';
    myImg?: string;
    yourImg?: string;

    // 피어리스 세트를 담아야한다
    nowSet?: number;
  };
}

const wss: WebSocketServer | null = null;
let clients: Client[] = [];
const globalForWs = global as unknown as { wss?: WebSocketServer; clients: Client[] };

export async function GET(req: NextRequest) {
  try {
    if (!globalForWs.wss) {
      console.log('🛠️ WebSocket 서버 초기화...');
      globalForWs.wss = new WebSocketServer({ port: 3001 });

      globalForWs.wss.on('connection', (ws, req) => {
        const urlParams = new URLSearchParams(req.url?.split('?')[1]);
        //room id
        const roomId = urlParams.get('roomId') as string;
        //user id
        const userId = urlParams.get('userId') as string;
        //
        const side = urlParams.get('side') as 'blue' | 'red' | 'audience' | undefined;
        const host = urlParams.get('host') === 'true';
        //room id와 user id 가 있고
        //room id와 user id가 둘다 없는 소켓상태
        console.log('roomId', roomId, 'userId', userId, 'roomId && userId', clients);
        if (roomId && userId && !clients.find((w) => w.roomId == roomId && w.userId == userId)) {
          //host 정보를 세팅하고 side만 반대로
          //TODO: 기타 정보도 사용자에 맞게 변경해야함
          //공유를 시작 host 여부
          //파람이 undefined 이면 host이며 그사람이 설정한 데이터가 기준!
          const hostRules = clients.find((client) => client.roomId === roomId && client.host);
          clients.push({ ...(hostRules as Client), userId, roomId, ws, host });
        }

        ws.on('message', (message: string) => {
          const data = JSON.parse(message);
          console.log('📩 받은 메시지:', data);
          if (data.type === 'init') {
            const hostRules = clients.find((client) => client.roomId === roomId && client.host);
            console.log(hostRules, 'hostRules');
            if (data.host) {
              clients
                .filter((client) => client.roomId === data.roomId)
                .forEach((client) => {
                  client.rules = { ...data.rules };
                });
            } else if (hostRules) {
              clients
                .filter((client) => client.roomId === data.roomId && client.userId === data.userId)
                .forEach((client) => {
                  client.rules = { ...hostRules.rules };
                  client.ws.send(JSON.stringify({ ...data, rules: client.rules }));
                });
            }
          }
          //이벤트는 추후 변경 예정
          if (data.type === 'ready') {
            const recipients = clients.filter((client) => client.roomId === data.roomId);

            if (recipients) {
              console.log(recipients, 'recipe');
              console.log(clients, 'clients');
              recipients.forEach((e) =>
                e.ws.send(
                  JSON.stringify({
                    ...data,
                    roomId,
                    userId,
                    side,
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
          //host가 종료하면 room 삭제
          if (host) {
            clients = clients.filter((client) => client.roomId !== roomId);
          }
          console.log(clients, 'clients');
          console.log(`❌ 클라이언트 연결 종료: ${roomId}`);
        });
      });
    }

    return NextResponse.json({ message: 'WebSocket server is running' });
  } catch (e) {
    console.log(e);
  }
}
