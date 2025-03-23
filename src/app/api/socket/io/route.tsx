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
  hostInfo: InfoType;
  guestInfo: InfoType;
  audienceCount: number;
  status: 'join' | 'ready';
}

type InitClient = Pick<Client, 'userId' | 'roomId' | 'ws' | 'host' | 'position' | 'role'>;

const wss: WebSocketServer | null = null;
let clients: (Client | InitClient)[] = [];
const globalForWs = global as unknown as { wss?: WebSocketServer; clients: (Client | InitClient)[] };

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
        const position = urlParams.get('position') as 'blue' | 'red' | 'audience' | undefined;
        const host = urlParams.get('host') === 'true';
        console.log('roomId', roomId, 'userId', userId, 'roomId && userId', clients);
        //room id와 user id 가 있고
        //room id와 user id가 둘다 없는 소켓상태
        if (roomId && userId && !clients.find((w) => w.roomId == roomId && w.userId == userId)) {
          //host 정보를 세팅하고
          //공유를 시작
          //파람이 undefined 이면 host이며 그사람이 설정한 데이터가 기준!
          //TODO: 기타 정보도 사용자에 맞게 변경해야함
          const hostRules = clients.find((client) => client.roomId === roomId && client.host);
          const initInfo: InitClient = {
            userId,
            roomId,
            ws,
            host,
            position,
            role: host ? 'host' : ['blue', 'red']?.includes(position as string) ? 'guest' : 'audience',
          };
          clients.push(initInfo);
        }

        ws.on('message', (message: string) => {
          const data = JSON.parse(message);
          console.log('📩 받은 메시지:', data);
          if (data.type === 'init') {
            const hostRules = clients.find((client) => client.roomId === roomId && client.host);
            //Client | Initclient 타입가드
            const isClient = (v: InitClient | Client): v is Client => {
              if ((v as Client).hostInfo) {
                return true;
              }
              return false;
            };
            console.log(hostRules, hostRules && isClient(hostRules), 'hostRules');
            const roomsClient = clients.filter((client) => client.roomId === data.roomId);
            //host일 때 가져온 rules 정보 세팅
            if (data.host) {
              roomsClient.forEach((client) => {
                console.log(data, 'data');
                if (client.host) {
                  Object.assign(client, data);
                }
              });
            } else if (hostRules && isClient(hostRules)) {
              console.log('들어옴', hostRules, roomsClient);
              const audienceClients = clients.filter(
                (client) => !client.host && client.roomId === data.roomId && client.role === 'audience',
              );
              //host 가 아닌 참가자 일때 가져온 rules 정보 세팅
              clients
                .filter((client) => client.roomId === data.roomId && client.userId === data.userId)
                .forEach((client) => {
                  const { banpickMode, peopleMode, timeUnlimited, nowSet, hostInfo } = hostRules as Client;
                  (client as Client).hostInfo = { ...hostInfo };
                  if (data.role === 'guest') {
                    (client as Client).guestInfo = {
                      myTeam: hostRules.hostInfo.yourTeam,
                      yourTeam: hostRules.hostInfo.myTeam,
                      myTeamSide: hostRules.hostInfo.myTeamSide === 'blue' ? 'red' : 'blue',
                      yourTeamSide: hostRules.hostInfo.myTeamSide === 'blue' ? 'blue' : 'red',
                      myImg: hostRules.hostInfo.yourImg,
                      yourImg: hostRules.hostInfo.myImg,
                      host: false,
                    };
                  }
                  (client as Client).ws.send(
                    JSON.stringify({
                      ...data,
                      banpickMode,
                      peopleMode,
                      timeUnlimited,
                      nowSet,
                      hostInfo,
                      role: data.role,
                      guestInfo: {
                        myTeam: hostRules.hostInfo.yourTeam,
                        yourTeam: hostRules.hostInfo.myTeam,
                        myTeamSide: hostRules.hostInfo.myTeamSide === 'blue' ? 'red' : 'blue',
                        myImg: hostRules.hostInfo.yourImg,
                        yourImg: hostRules.hostInfo.myImg,
                        host: false,
                        position: position,
                        role: data.role,
                      },
                    }),
                  );
                });
            }
          }
          if (data.type === 'join') {
            const hostRules = clients.find((client) => client.roomId === roomId && client.host);

            console.log(hostRules, 'hostRules');
            //Client | Initclient 타입가드
            const isClient = (v: InitClient | Client): v is Client => {
              if ((v as Client).hostInfo) {
                return true;
              }
              return false;
            };
            console.log(hostRules, 'hostRules');
            const roomsClient = clients.filter((client) => client.roomId === data.roomId);
            //host일 때 가져온 rules 정보 세팅
            if (data.host) {
              roomsClient.forEach((client) => {
                console.log(data, 'data');
                if (client.host) {
                  if (isClient(client)) {
                    client.hostInfo.status = 'join';
                  }
                }
              });
            } else if (hostRules && isClient(hostRules)) {
              const guestClients = clients.filter(
                (client) => !client.host && client.roomId === data.roomId && client.role === 'guest',
              );
              if (guestClients.length > 1) {
                guestClients[1].ws.send(
                  JSON.stringify({
                    type: 'overCount',
                  }),
                );
                return;
              }
              //host 가 아닌 참가자 일때 가져온 rules 정보 세팅
              clients
                .filter((client) => client.roomId === data.roomId && client.userId === data.userId)
                .forEach((client) => {
                  const { banpickMode, peopleMode, timeUnlimited, nowSet, hostInfo } = hostRules as Client;
                  (client as Client).hostInfo = { ...hostInfo };
                  if (data.role === 'guest') {
                    (client as Client).guestInfo.status = 'join';
                  }
                });
            } else {
              console.log(roomsClient, 'roomClient');
              roomsClient.forEach((client) => {
                client.ws.send(JSON.stringify({ type: 'noRoom' }));
              });
              return;
            }

            const audienceClients = clients.filter(
              (client) => !client.host && client.roomId === data.roomId && client.role === 'audience',
            );
            console.log(roomsClient, '조인');
            roomsClient.forEach((client) => {
              (client as Client).ws.send(
                JSON.stringify({
                  type: 'join',
                  userId,
                  role: client.role,
                  guestInfo: (client as Client).guestInfo,
                  hostInfo: (client as Client).hostInfo,
                  audienceCount: audienceClients.length,
                }),
              );
            });
          }
          //이벤트는 추후 변경 예정
          if (data.type === 'ready') {
            const recipients = clients.filter((client) => client.roomId === data.roomId);

            if (recipients) {
              recipients.forEach((e) =>
                e.ws.send(
                  JSON.stringify({
                    ...data,
                    roomId,
                    userId,
                    position,
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
          if (data.type === 'emit') {
            const roomsClient = clients.filter((client) => client.roomId === data.roomId);

            roomsClient.forEach((client) => {
              client.ws.send(JSON.stringify({ type: 'on', params: data.params }));
            });
          }
        });
        ws.on('close', () => {
          //host가 종료하면 room 삭제
          if (host) {
            clients.forEach((client) => {
              if (client.roomId === roomId) {
                client.ws.send(JSON.stringify({ type: 'closeByHost' }));
              }
            });
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
