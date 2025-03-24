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

let clients: (Client | InitClient)[] = [];
const globalForWs = global as unknown as { wss?: WebSocketServer; clients: (Client | InitClient)[] };

export async function GET(req: NextRequest) {
  try {
    if (!globalForWs.wss) {
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
          const initInfo: InitClient = {
            userId,
            roomId,
            ws,
            host,
            position,
            role: host ? 'host' : ['blue', 'red']?.includes(position as string) ? 'guest' : 'audience',
            hostInfo: { status: '' },
            guestInfo: { status: '' },
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
              //호스트 정보 바탕으로 세팅
              roomsClient.forEach((client) => {
                console.log(data, 'data');
                if (client.host) {
                  const { type, ...hostInfo } = data;
                  hostInfo.hostInfo.status = '';
                  Object.assign(client, hostInfo);
                }

                ((client as Client).guestInfo as InfoType) = {
                  myTeam: (data.hostInfo as InfoType).yourTeam,
                  yourTeam: (data.hostInfo as InfoType).myTeam,
                  myTeamSide: (data.hostInfo as InfoType).myTeamSide === 'blue' ? 'red' : 'blue',
                  yourTeamSide: (data.hostInfo as InfoType).myTeamSide === 'blue' ? 'blue' : 'red',
                  myImg: (data.hostInfo as InfoType).yourImg,
                  yourImg: (data.hostInfo as InfoType).myImg,
                  host: false,
                  status: '',
                };
              });
            }
          }
          if (data.type === 'join') {
            const hostRules = clients.find((client) => client.roomId === roomId && client.host);

            const roomsClient = clients.filter((client) => client.roomId === data.roomId);

            const guestClients = clients.filter(
              (client) => !client.host && client.roomId === data.roomId && client.role === 'guest',
            );
            //Client | Initclient 타입가드
            const isClient = (v: InitClient | Client): v is Client => {
              if ((v as Client).hostInfo) {
                return true;
              }
              return false;
            };
            console.log(hostRules, 'hostRules');
            //host가 조인할때
            if (data.host) {
              roomsClient.forEach((client) => {
                (client as Client).hostInfo.status = 'join';
              });
            } else if (hostRules && isClient(hostRules)) {
              //두명의 게스트가 들어올때
              if (guestClients.length > 1) {
                guestClients[1].ws.send(
                  JSON.stringify({
                    type: 'overCount',
                  }),
                );
                return;
              }
              //게스타 조인할때
              if (data.role === 'guest') {
                roomsClient.forEach((client) => {
                  (client as Client).guestInfo.status = 'join';
                });
              }
              roomsClient.forEach((client) => {
                ((client as Client).guestInfo as InfoType) = {
                  myTeam: (hostRules.hostInfo as InfoType).yourTeam,
                  yourTeam: (hostRules.hostInfo as InfoType).myTeam,
                  myTeamSide: (hostRules.hostInfo as InfoType).myTeamSide === 'blue' ? 'red' : 'blue',
                  yourTeamSide: (hostRules.hostInfo as InfoType).myTeamSide === 'blue' ? 'blue' : 'red',
                  myImg: (hostRules.hostInfo as InfoType).yourImg,
                  yourImg: (hostRules.hostInfo as InfoType).myImg,
                  host: false,
                  status: (client as Client).guestInfo.status,
                };
                ((client as Client).hostInfo as InfoType) = { ...(hostRules.hostInfo as InfoType) };
              });
            } else {
              console.log(roomsClient, 'roomClient');
              //호스트가 게임을 종료할때
              roomsClient.forEach((client) => {
                client.ws.send(JSON.stringify({ type: 'noRoom' }));
              });
              return;
            }

            const audienceClients = clients.filter(
              (client) => !client.host && client.roomId === data.roomId && client.role === 'audience',
            );
            const guestInfoClient = clients.find(
              (client) =>
                client.roomId === data.roomId && client.role === 'guest' && client.guestInfo.status === 'join',
            );
            const hostInfoClient = clients.find(
              (client) => client.roomId === data.roomId && client.role === 'host' && client.hostInfo.status === 'join',
            );
            console.log(guestInfoClient, hostInfoClient, '@@@');
            roomsClient.forEach((client) => {
              const { ws, ...sendInfo } = client;
              if (guestInfoClient) {
                ((client as Client).guestInfo as InfoType) = guestInfoClient?.guestInfo as InfoType;
              }
              if (hostInfoClient) {
                ((client as Client).hostInfo as InfoType) = hostInfoClient?.hostInfo as InfoType;
              }
            });
            roomsClient.forEach((client) => {
              const { ws, ...sendInfo } = client;
              console.log(roomsClient, { type: 'join', ...sendInfo, audienceCount: audienceClients.length }, '조인');
              client.ws.send(JSON.stringify({ type: 'join', ...sendInfo, audienceCount: audienceClients.length }));
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
          } else {
            if (position !== 'audience' && !host) {
              console.log(
                clients.filter((client) => client.roomId === roomId),
                roomId,
                'guest@@',
              );
              console.log(clients, 'guest@@');
              clients
                .filter((client) => client.roomId === roomId)
                .forEach((client) => {
                  client.guestInfo.status = '';
                });

              const audienceCount = clients.filter(
                (client) => client.roomId === roomId && client.position === 'audience',
              ).length;
              clients
                .filter((client) => client.roomId === roomId)
                .forEach((client) => {
                  const { ws, ...sendInfo } = client;
                  client.ws.send(JSON.stringify({ type: 'closeByGuest', ...sendInfo, audienceCount }));
                });
              clients = clients.filter((client) => client.userId !== userId);
            } else if (position === 'audience') {
              clients = clients.filter((client) => client.userId !== userId);
              const audienceCount = clients.filter(
                (client) => client.roomId === roomId && client.position === 'audience',
              ).length;
              clients
                .filter((client) => client.roomId === roomId)
                .forEach((client) => {
                  client.ws.send(JSON.stringify({ type: 'closeByAudience', audienceCount }));
                });
            }
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
