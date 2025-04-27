import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { config } from 'dotenv';

config({ path: './.env.production' });

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL },
  transports: ['websocket'],
});

const PORT = process.env.PORT || 4000;

let clients = []; // 기존 clients 배열 유지

app.get('/', (req, res) => {
  res.send('Backend is running');
});

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // const urlParams = new URLSearchParams(socket.handshake.query.url?.split('?')[1]);
  // const roomId = urlParams.get('roomId');
  // const userId = urlParams.get('userId');
  // const position = urlParams.get('position');
  // const host = urlParams.get('host') === 'true';
  // const urlParams = new URLSearchParams(socket.handshake.query.url?.split('?')[1]);
  let roomId = '';
  let userId = '';
  let position = '';
  let host = '';

  console.log(`📝 Connection details - roomId: ${roomId}, userId: ${userId}, position: ${position}, host: ${host}`);

  // socket.on('rejoin', ({ roomId, userId, position, host }) => {
  //   socket.join(roomId);
  //   clients.push({
  //     socketId: socket.id,
  //     roomId,
  //     userId,
  //     position,
  //     host,
  //     role: host ? 'host' : ['blue', 'red'].includes(position) ? 'guest' : 'audience',
  //     hostInfo: { status: '' },
  //     guestInfo: { status: '' },
  //   });
  //   console.log('🔄 Client rejoined:', roomId, userId);
  // });

  socket.on('init', (_data) => {
    console.log('🎮 Initializing game settings');
    let data = JSON.parse(JSON.stringify(_data));
    roomId = data.roomId;
    userId = data.userId;
    position = data.position;
    host = data.host;
    delete data.type;
    console.log('Initial data:', data);
    const target = clients.find((w) => w.userId === data.userId);
    const initInfo = {
      ...data,
      socket, // ws 대신 socket
      role: data.host ? 'host' : ['blue', 'red'].includes(data.position) ? 'guest' : 'audience',
      hostInfo: { ...data.hostInfo, status: '' },
      guestInfo: { status: '' },
    };
    if (target) {
      clients = clients.map((w) => {
        if (w.userId === data.userId) {
          w = { ...w, ...initInfo };
        }
        return w;
      });
    } else {
      clients.push(initInfo);
    }

    const roomsClient = clients.filter((client) => client.roomId === data.roomId);
    roomsClient.forEach((client) => {
      client.guestInfo = {
        myTeam: client.hostInfo.yourTeam,
        yourTeam: client.hostInfo.myTeam,
        myTeamSide: client.hostInfo.myTeamSide === 'blue' ? 'red' : 'blue',
        yourTeamSide: client.hostInfo.myTeamSide === 'blue' ? 'blue' : 'red',
        myImg: client.hostInfo.yourImg,
        yourImg: client.hostInfo.myImg,
        host: false,
        status: client.status,
      };
    });
  });

  socket.on('join', (data) => {
    console.log('🚪 Processing join request', JSON.stringify(data));
    roomId = data.roomId;
    userId = data.userId;
    position = data.position;
    host = data.host;
    const roomsClient = clients.filter((client) => client.roomId === data.roomId);
    const guestClients = clients.filter(
      (client) => !client.host && client.roomId === data.roomId && client.role === 'guest',
    );
    const audienceClients = clients.filter(
      (client) => !client.host && client.roomId === data.roomId && client.role === 'audience',
    );
    const guestInfoClient = clients.find(
      (client) => client.roomId === data.roomId && client.role === 'guest' && client.guestInfo.status === 'join',
    );
    const hostInfoClient = clients.find(
      (client) => client.roomId === data.roomId && client.role === 'host' && client.hostInfo.status === 'join',
    );
    let hostRules = roomsClient.find((client) => {
      return client.host;
    });
    console.log(
      'hostRu ',
      hostRules,
      data.roomId,
      roomsClient.map((v) => ({
        userId: v.userId,
        roomId: v.roomId,
        host: v.host,
        role: v.role,
        status: v.hostInfo.status,
        Gstatus: v.guestInfo.status,
      })),
      guestClients.map((v) => ({
        userId: v.userId,
        roomId: v.roomId,
        host: v.host,
        role: v.role,
        status: v.status,
        Gstatus: v.guestInfo.status,
      })),
    );
    if (data.host) {
      roomsClient.forEach((client) => {
        client.hostInfo.status = 'join';
      });
      console.log('여기야1');
    } else if (hostRules) {
      if (guestClients.length > 1) {
        guestClients[1].socket.emit('overCount');
        console.log('여기야2');
        return;
      }

      if (data.role === 'guest') {
        roomsClient.forEach((client) => {
          client.guestInfo.status = 'join';
        });
        console.log(
          '여기야3',
          roomsClient.map((v) => ({
            userId: v.userId,
            roomId: v.roomId,
            hostInfo: v.hostInfo,
            guestInfo: v.guestInfo,
            role: v.role,
          })),
          guestClients.map((v) => ({
            userId: v.userId,
            roomId: v.roomId,
            hostInfo: v.hostInfo,
            guestInfo: v.guestInfo,
            role: v.role,
          })),
        );
      }

      console.log('여기c', guestInfoClient);
      roomsClient.forEach((client) => {
        client.banpickMode = hostRules.banpickMode;
        client.peopleMode = hostRules.peopleMode;
        client.timeUnlimited = hostRules.timeUnlimited;
        client.nowSet = hostRules.nowSet;

        client.hostInfo = { ...hostRules.hostInfo };
        console.log('여기c', guestInfoClient.guestInfo);
        client.guestInfo = {
          myTeam: hostRules.hostInfo.yourTeam,
          yourTeam: hostRules.hostInfo.myTeam,
          myTeamSide: hostRules.hostInfo.myTeamSide === 'blue' ? 'red' : 'blue',
          yourTeamSide: hostRules.hostInfo.myTeamSide === 'blue' ? 'blue' : 'red',
          myImg: hostRules.hostInfo.yourImg,
          yourImg: hostRules.hostInfo.myImg,
          host: false,
          status: guestInfoClient.guestInfo.status,
        };
      });
      console.log(
        '여기야3_1',
        roomsClient.map((v) => ({
          userId: v.userId,
          roomId: v.roomId,
          hostInfo: v.hostInfo,
          guestInfo: v.guestInfo,
          role: v.role,
          status: v.status,
        })),
        guestClients.map((v) => ({
          userId: v.userId,
          roomId: v.roomId,
          hostInfo: v.hostInfo,
          guestInfo: v.guestInfo,
          role: v.role,
          status: v.status,
        })),
      );
    } else {
      console.log('❌ No host rules found');
      roomsClient.forEach((client) => {
        client.socket.emit('noRoom');
      });
      return;
    }

    // if (guestInfoClient || hostInfoClient) {
    //   roomsClient.forEach((client) => {
    //     if (guestInfoClient) {
    //       client.guestInfo = { ...guestInfoClient.guestInfo };
    //     }
    //     if (hostInfoClient) {
    //       client.hostInfo = { ...hostInfoClient.hostInfo };
    //     }
    //   });
    //   console.log('🔄 Room info synchronized');
    // }

    roomsClient.forEach((client) => {
      const { socket, ...sendInfo } = client;
      client.socket.emit('join', {
        ...sendInfo,
        audienceCount: audienceClients.length,
      });
    });

    console.log(
      '여기야4',
      roomsClient.map((v) => ({
        userId: v.userId,
        roomId: v.roomId,
        hostInfo: v.hostInfo,
        guestInfo: v.guestInfo,
        role: v.role,
      })),
    );
  });

  socket.on('emit', (data) => {
    const { roomId, params } = data;
    const roomsClient = clients.filter((client) => client.roomId === roomId);

    roomsClient.forEach((client) => {
      client.socket.emit('on', { params });
    });
  });

  socket.on('ready', (data) => {
    const { roomId, role } = data;
    const roomsClient = clients.filter((client) => client.roomId === roomId);
    const audienceClients = clients.filter(
      (client) => !client.host && client.roomId === roomId && client.role === 'audience',
    );

    roomsClient.forEach((client) => {
      if (role === 'host') {
        client.hostInfo.status = 'ready';
      }
      if (role === 'guest') {
        client.guestInfo.status = 'ready';
      }
      const { socket, ...sendInfo } = client;
      client.socket.emit('ready', {
        ...sendInfo,
        audienceCount: audienceClients.length,
      });
    });
  });

  socket.on('readyCancel', (data) => {
    const { roomId, role } = data;
    const roomsClient = clients.filter((client) => client.roomId === roomId);
    const audienceClients = clients.filter(
      (client) => !client.host && client.roomId === roomId && client.role === 'audience',
    );

    roomsClient.forEach((client) => {
      if (role === 'host') {
        client.hostInfo.status = 'join';
      }
      if (role === 'guest') {
        client.guestInfo.status = 'join';
      }
      const { socket, ...sendInfo } = client;
      client.socket.emit('readyCancel', {
        ...sendInfo,
        audienceCount: audienceClients.length,
      });
    });
  });
  socket.on('banpickStart', (data) => {
    const roomsClient = clients.filter((client) => client.roomId === data.roomId);
    roomsClient.forEach((client) => {
      client.socket.emit('banpickStart');
    });
  });

  socket.on('image', (data) => {
    const roomsClient = clients.filter((client) => client.roomId === data.roomId);
    roomsClient.forEach((client) => {
      client.socket.emit('image', { params: data.data });
    });
  });

  socket.on('champion', (data) => {
    const roomsClient = clients.filter((client) => client.roomId === data.roomId);
    roomsClient.forEach((client) => {
      client.socket.emit('champion');
    });
  });

  socket.on('random', (data) => {
    const roomsClient = clients.filter((client) => client.roomId === data.roomId);
    roomsClient.forEach((client) => {
      client.socket.emit('random', { data: data.data });
    });
  });

  socket.on('Peerless', (data) => {
    const roomsClient = clients.filter((client) => client.roomId === data.roomId);
    roomsClient.forEach((client) => {
      client.socket.emit('Peerless');
    });
  });

  socket.on('clearPeerless', (data) => {
    const roomsClient = clients.filter((client) => client.roomId === data.roomId);
    roomsClient.forEach((client) => {
      client.socket.emit('clearPeerless');
    });
  });

  socket.on('teamChange', (data) => {
    const roomsClient = clients.filter((client) => client.roomId === data.roomId);
    roomsClient.forEach((client) => {
      client.socket.emit('teamChange');
    });
  });

  socket.on('closeSharePopup', (data) => {
    console.log(
      'closeSharePopup',
      clients.map((v) => ({
        userId: v.userId,
        roomId: v.roomId,
        hostInfo: v.hostInfo,
        guestInfo: v.guestInfo,
        role: v.role,
      })),
    );
    // userId에 해당하는 host는 남기고 roomId 제거
    // 나머지 비호스트에게 noRoom 전송
    clients
      .filter((client) => client.roomId === data.roomId && !client.host)
      .forEach((client) => {
        client.socket.emit('noRoom');
      });
    clients = clients.filter(
      (client) => client.roomId !== data.roomId || (client.userId === data.userId && client.host),
    );

    console.log(
      clients.filter((client) => client.roomId === data.roomId && !client.host),
      '??' + data.roomId,
    );
  });

  // 소켓 연결 끊어졌을 때
  socket.on('disconnect', (reason) => {
    console.log(
      `❌ Client disconnecting - roomId: ${roomId}, userId: ${userId}, ${clients.map((e) => ({ roomId: e.roomId, userId: e.userId }))}`,
      'reason:',
      reason,
    );

    if (host) {
      console.log('👑 Host disconnected, closing room');
      clients
        .filter((client) => client.roomId === roomId)
        .forEach((client) => {
          client.socket.emit('closeByHost');
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
            client.socket.emit('closeByGuest', {
              ...sendInfo,
              audienceCount: audienceClients.length,
            });
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
            client.socket.emit('closeByAudience', { audienceCount });
          });
      }
    }
    console.log(`🚫 Connection fully closed - roomId: ${roomId}`);
  });
});
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
