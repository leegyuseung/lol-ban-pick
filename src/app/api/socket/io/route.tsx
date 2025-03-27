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

          const roomsClient = clients.filter((client) => client.roomId === data.roomId);
          const audienceClients = clients.filter(
            (client) => !client.host && client.roomId === data.roomId && client.role === 'audience',
          );
          const guestInfoClient = clients.find(
            (client) => client.roomId === data.roomId && client.role === 'guest' && client.guestInfo.status === 'join',
          );
          const hostInfoClient = clients.find(
            (client) => client.roomId === data.roomId && client.role === 'host' && client.hostInfo.status === 'join',
          );
          let hostRules = clients.find((client) => client.roomId === (roomId || data.roomId) && client.host);
          if (data.type === 'init') {
            //Client | Initclient 타입가드
            const isClient = (v: InitClient | Client): v is Client => {
              if ((v as Client).hostInfo) {
                return true;
              }
              return false;
            };
            //host일 때 가져온 rules 정보 세팅
            if (data.host) {
              //host의 아이디가 사용된 ws가 있다면 그 값에 initData추가
              const target: Client | undefined = clients.find((w) => w.userId == userId) as Client;
              console.log(
                clients,
                roomId,
                data.roomId,
                hostRules,
                hostRules && isClient(hostRules),
                target,
                'hostRules',
              );
              if (target) {
                //host 정보를 세팅하고
                //공유를 시작
                //파람이 undefined 이면 host이며 그사람이 설정한 데이터가 기준!

                const initInfo: InitClient = {
                  userId,
                  roomId: data.roomId,
                  ws,
                  host,
                  position,
                  role: host ? 'host' : ['blue', 'red']?.includes(position as string) ? 'guest' : 'audience',
                  hostInfo: { status: '' },
                  guestInfo: { status: '' },
                };
                clients = clients.map((w) => {
                  if (w.userId == userId) {
                    w = { ...w, ...initInfo };
                  }
                  return w;
                });

                hostRules = clients.find((client) => client.roomId === data.roomId && client.host);
              }
              const roomsClient = clients.filter((client) => client.roomId === data.roomId);
              console.log(roomsClient, clients, 'roomClient');
              //호스트 정보 바탕으로 세팅
              roomsClient.forEach((client) => {
                console.log(data, 'data');
                if (client.host) {
                  const { type, ...hostInfo } = data;

                  console.log(data, hostInfo, 'data&hostInfo');
                  hostInfo.hostInfo.status = '';
                  Object.assign(client, hostInfo);
                  console.log(client, 'data&hostInfo');
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
          //공유페이지에 접속했을때
          if (data.type === 'join') {
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
            console.log(clients, 'hostRulesGuestJoin');
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
                if (isClient(client)) {
                  client.banpickMode = hostRules.banpickMode;
                  client.peopleMode = hostRules.peopleMode;
                  client.timeUnlimited = hostRules.timeUnlimited;
                  client.nowSet = hostRules.nowSet;
                  (client.guestInfo as InfoType) = {
                    myTeam: (hostRules.hostInfo as InfoType).yourTeam,
                    yourTeam: (hostRules.hostInfo as InfoType).myTeam,
                    myTeamSide: (hostRules.hostInfo as InfoType).myTeamSide === 'blue' ? 'red' : 'blue',
                    yourTeamSide: (hostRules.hostInfo as InfoType).myTeamSide === 'blue' ? 'blue' : 'red',
                    myImg: (hostRules.hostInfo as InfoType).yourImg,
                    yourImg: (hostRules.hostInfo as InfoType).myImg,
                    host: false,
                    status: client.guestInfo.status,
                  };
                  (client.hostInfo as InfoType) = { ...(hostRules.hostInfo as InfoType) };
                }
              });
            } else {
              console.log(roomsClient, 'roomClient');
              //호스트가 게임을 종료할때
              roomsClient.forEach((client) => {
                client.ws.send(JSON.stringify({ type: 'noRoom' }));
              });
              return;
            }

            console.log(guestInfoClient, hostInfoClient, '@@@');
            roomsClient.forEach((client) => {
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
          if (data.type === 'emit') {
            roomsClient.forEach((client) => {
              client.ws.send(JSON.stringify({ type: 'on', params: data.params }));
            });
          }
          if (data.type === 'ready') {
            roomsClient.forEach((client) => {
              if (data.role === 'host') {
                client.hostInfo.status = 'ready';
              }
              if (data.role === 'guest') {
                client.guestInfo.status = 'ready';
              }
              const { ws, ...sendInfo } = client;
              console.log(client, sendInfo, 'client');
              console.log({ type: 'ready', ...sendInfo, audienceCount: audienceClients.length }, 'result');
              client.ws.send(JSON.stringify({ type: 'ready', ...sendInfo, audienceCount: audienceClients.length }));
            });
          }

          if (data.type === 'banpickStart') {
            roomsClient.forEach((client) => {
              const { ws, ...sendInfo } = client;
              client.ws.send(JSON.stringify({ type: 'banpickStart' }));
            });
          }
          if (data.type === 'image') {
            const roomsClient = clients.filter((client) => client.roomId === data.roomId);
            roomsClient.forEach((client) => {
              client.ws.send(JSON.stringify({ type: 'image', params: data.data }));
            });
          }

          if (data.type === 'champion') {
            const roomsClient = clients.filter((client) => client.roomId === data.roomId);
            roomsClient.forEach((client) => {
              client.ws.send(JSON.stringify({ type: 'champion' }));
            });
          }

          if (data.type === 'random') {
            const roomsClient = clients.filter((client) => client.roomId === data.roomId);
            roomsClient.forEach((client) => {
              client.ws.send(JSON.stringify({ type: 'random', data: data.data }));
            });
          }

          if (data.type === 'Peerless') {
            const roomsClient = clients.filter((client) => client.roomId === data.roomId);
            roomsClient.forEach((client) => {
              client.ws.send(JSON.stringify({ type: 'Peerless' }));
            });
          }

          if (data.type === 'clearPeerless') {
            const roomsClient = clients.filter((client) => client.roomId === data.roomId);
            roomsClient.forEach((client) => {
              client.ws.send(JSON.stringify({ type: 'clearPeerless' }));
            });
          }

          //메인페이지에서 공유 팝업 닫기를 누를때!
          //userId에 할당된 room에 room번호만 삭제
          if (data.type === 'closeSharePopup') {
            console.log(
              clients,
              clients
                .filter((client) => client.roomId === data.roomId && !client.host)
                .forEach((client) => {
                  client.ws.send(JSON.stringify({ type: 'noRoom' }));
                }),
              data.roomId,
              'closeSharePopup',
            );
            clients = clients.filter(
              (client) => client.roomId !== data.roomId || (client.userId == userId && client.host),
            );
            //나온 팝업에 의해 공유된 페이지 종료
            clients
              .filter((client) => client.roomId === data.roomId && !client.host)
              .forEach((client) => {
                client.ws.send(JSON.stringify({ type: 'noRoom' }));
              });
            console.log(clients, data.userId, data.roomId, 'closeSharePopup2');
            // clients.filter((client) => client.roomId !== data.roomId || client.host).forEach(client=>{
            //   client.roomId
            // })
            roomsClient.forEach((client) => {
              client.ws.send(JSON.stringify({ type: 'closeSharePopup', data: data.data }));
            });
          }
        });

        ws.on('close', () => {
          //host가 종료하면 room 삭제
          console.log(clients, '클로즈');
          if (host) {
            clients.forEach((client) => {
              if (client.roomId === roomId) {
                client.ws.send(JSON.stringify({ type: 'closeByHost' }));
              }
            });
            clients = clients.filter((client) => client.roomId !== roomId);
          } else {
            if (position !== 'audience' && !host) {
              const audienceClients = clients.filter(
                (client) => !client.host && client.roomId === roomId && client.role === 'audience',
              );
              console.log(
                clients,
                clients.filter((client) => client.roomId === roomId),
                roomId,
                'guest@@',
              );
              clients
                .filter((client) => client.roomId === roomId)
                .forEach((client) => {
                  client.guestInfo.status = '';
                });

              clients
                .filter((client) => client.roomId === roomId)
                .forEach((client) => {
                  const { ws, ...sendInfo } = client;
                  client.ws.send(
                    JSON.stringify({ type: 'closeByGuest', ...sendInfo, audienceCount: audienceClients.length }),
                  );
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
