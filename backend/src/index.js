import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { config } from 'dotenv';
const app = express();
config({ path: './.env.production' });
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);

const PORT = process.env.PORT;

// 여기서 기본 라우트 설정!
app.get('/', (req, res) => {
  res.send('Backend is running');
});
// 클라이언트 관리

let clients = [];

const server = app.listen(PORT, () => {
  console.log(`🚀 WebSocket Server is running on port ${PORT}` + process.env.CLIENT_URL);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  console.log('🔌 New WebSocket connection attempt');

  const urlParams = new URLSearchParams(req.url?.split('?')[1]);
  const roomId = urlParams.get('roomId');
  const userId = urlParams.get('userId');
  const position = urlParams.get('position');
  const host = urlParams.get('host') === 'true';

  console.log(`📝 Connection details - roomId: ${roomId}, userId: ${userId}, position: ${position}, host: ${host}`);

  if (roomId && userId && !clients.find((w) => w.roomId === roomId && w.userId === userId)) {
    const initInfo = {
      userId,
      roomId,
      ws,
      host,
      position,
      role: host ? 'host' : ['blue', 'red'].includes(position) ? 'guest' : 'audience',
      hostInfo: { status: '' },
      guestInfo: { status: '' },
    };
    clients.push(initInfo);
    console.log(`✅ Client added to room ${roomId}`);
  }

  ws.on('message', (message) => {
    const data = JSON.parse(message.toString());
    console.log('📩 Received message:', data);

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
    let hostRules = clients.find((client) => client.roomId === data.roomId && client.host);

    console.log(`🔍 Room ${data.roomId} status:
      - guest: ${guestInfoClient}
      - host: ${hostInfoClient}
    `);

    if (data.type === 'init') {
      console.log('🎮 Initializing game settings');
      console.log('Initial data:', data);

      if (data.host) {
        const target = clients.find((w) => w.userId === userId);
        if (target) {
          const initInfo = {
            userId,
            roomId: data.roomId,
            ws,
            host,
            position,
            role: host ? 'host' : ['blue', 'red'].includes(position) ? 'guest' : 'audience',
            hostInfo: { status: '' },
            guestInfo: { status: '' },
          };
          clients = clients.map((w) => {
            if (w.userId === userId) {
              w = { ...w, ...initInfo };
            }
            return w;
          });

          hostRules = clients.find((client) => client.roomId === data.roomId && client.host);
        }
        const roomsClient = clients.filter((client) => client.roomId === data.roomId);
        roomsClient.forEach((client) => {
          if (client.host) {
            const { type, ...hostInfo } = data;
            hostInfo.hostInfo.status = '';
            Object.assign(client, hostInfo);
          }

          client.guestInfo = {
            myTeam: data.hostInfo.yourTeam,
            yourTeam: data.hostInfo.myTeam,
            myTeamSide: data.hostInfo.myTeamSide === 'blue' ? 'red' : 'blue',
            yourTeamSide: data.hostInfo.myTeamSide === 'blue' ? 'blue' : 'red',
            myImg: data.hostInfo.yourImg,
            yourImg: data.hostInfo.myImg,
            host: false,
            status: '',
          };
        });
      }
    }

    if (data.type === 'join') {
      console.log('🚪 Processing join request');

      const guestClients = clients.filter(
        (client) => !client.host && client.roomId === data.roomId && client.role === 'guest',
      );

      if (data.host) {
        roomsClient.forEach((client) => {
          client.hostInfo.status = 'join';
        });
      } else if (hostRules) {
        if (guestClients.length > 1) {
          guestClients[1].ws.send(
            JSON.stringify({
              type: 'overCount',
            }),
          );
          return;
        }

        if (data.role === 'guest') {
          roomsClient.forEach((client) => {
            client.guestInfo.status = 'join';
          });
        }

        roomsClient.forEach((client) => {
          client.banpickMode = hostRules.banpickMode;
          client.peopleMode = hostRules.peopleMode;
          client.timeUnlimited = hostRules.timeUnlimited;
          client.nowSet = hostRules.nowSet;

          client.hostInfo = { ...hostRules.hostInfo };

          client.guestInfo = {
            myTeam: hostRules.hostInfo.yourTeam,
            yourTeam: hostRules.hostInfo.myTeam,
            myTeamSide: hostRules.hostInfo.myTeamSide === 'blue' ? 'red' : 'blue',
            yourTeamSide: hostRules.hostInfo.myTeamSide === 'blue' ? 'blue' : 'red',
            myImg: hostRules.hostInfo.yourImg,
            yourImg: hostRules.hostInfo.myImg,
            host: false,
            status: client.guestInfo.status,
          };
        });
      } else {
        console.log('❌ No host rules found');
        roomsClient.forEach((client) => {
          client.ws.send(JSON.stringify({ type: 'noRoom' }));
        });
        return;
      }

      if (guestInfoClient || hostInfoClient) {
        roomsClient.forEach((client) => {
          if (guestInfoClient) {
            client.guestInfo = { ...guestInfoClient.guestInfo };
          }
          if (hostInfoClient) {
            client.hostInfo = { ...hostInfoClient.hostInfo };
          }
        });
        console.log('🔄 Room info synchronized');
      }

      roomsClient.forEach((client) => {
        const { ws, ...sendInfo } = client;
        client.ws.send(
          JSON.stringify({
            type: 'join',
            ...sendInfo,
            audienceCount: audienceClients.length,
          }),
        );
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
        client.ws.send(JSON.stringify({ type: 'ready', ...sendInfo, audienceCount: audienceClients.length }));
      });
    }

    if (data.type === 'readyCancel') {
      roomsClient.forEach((client) => {
        if (data.role === 'host') {
          client.hostInfo.status = 'join';
        }
        if (data.role === 'guest') {
          client.guestInfo.status = 'join';
        }
        const { ws, ...sendInfo } = client;
        client.ws.send(JSON.stringify({ type: 'readyCancel', ...sendInfo, audienceCount: audienceClients.length }));
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

    if (data.type === 'teamChange') {
      const roomsClient = clients.filter((client) => client.roomId === data.roomId);
      roomsClient.forEach((client) => {
        client.ws.send(JSON.stringify({ type: 'teamChange' }));
      });
    }
    //메인페이지에서 공유 팝업 닫기를 누를때!
    //userId에 할당된 room에 room번호만 삭제
    if (data.type === 'closeSharePopup') {
      clients = clients.filter((client) => client.roomId !== data.roomId || (client.userId == userId && client.host));
      //나온 팝업에 의해 공유된 페이지 종료
      clients
        .filter((client) => client.roomId === data.roomId && !client.host)
        .forEach((client) => {
          client.ws.send(JSON.stringify({ type: 'noRoom' }));
        });
      // clients.filter((client) => client.roomId !== data.roomId || client.host).forEach(client=>{
      //   client.roomId
      // })
      roomsClient.forEach((client) => {
        client.ws.send(JSON.stringify({ type: 'closeSharePopup', data: data.data }));
      });
    }
  });
  ws.on('error', (err) => {
    console.error(`❗ WebSocket error - roomId: ${roomId}, userId: ${userId}, clients:${clients}`);
    console.log(`❗ WebSocket error - roomId: ${roomId}, userId: ${userId}, clients:${clients}`);
    console.error(err); // 어떤 에러인지 콘솔에 출력
  });
  ws.on('close', (e) => {
    console.log(
      `❌ Client disconnecting - roomId: ${roomId}, userId: ${userId},${clients.map((e) => ({ roomId: e.roomId, userId: e.userId }))}`,
      'error' + JSON.stringify(e),
    );
    if (host) {
      console.log('👑 Host disconnected, closing room');
      clients.forEach((client) => {
        if (client.roomId === roomId) {
          client.ws.send(JSON.stringify({ type: 'closeByHost' }));
        }
      });
      clients = clients.filter((client) => client.roomId !== roomId);
    } else {
      if (position !== 'audience' && !host) {
        console.log('👥 Guest disconnected');
        const audienceClients = clients.filter(
          (client) => !client.host && client.roomId === roomId && client.role === 'audience',
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
              JSON.stringify({
                type: 'closeByGuest',
                ...sendInfo,
                audienceCount: audienceClients.length,
              }),
            );
          });
        clients = clients.filter((client) => client.userId !== userId);
      } else if (position === 'audience') {
        console.log('👀 Audience member disconnected');
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
    console.log(`🚫 Connection closed - roomId: ${roomId}`);
  });
});
