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

  let roomId = '';
  let userId = '';
  let position = '';
  let host = '';
  let role = '';

  console.log(`📝 Connection details - roomId: ${roomId}, userId: ${userId}, position: ${position}, host: ${host}`);

  socket.on('init', (_data) => {
    console.log('🎮 Initializing game settings');
    let data = JSON.parse(JSON.stringify(_data));
    roomId = data.roomId; //roomId
    userId = data.userId; //userId
    position = data.position; //블루인지. 레드인지
    host = data.host; //호스트여부
    role = data.role; //host, guest, audience
    delete data.type;
    console.log('Initial data:', data);

    const target = clients.find((w) => w.userId === data.userId);
    let initInfo;
    //관중아닐때. hostinfo나 guestinfo를 설정하지 않는다. 덮어쓰여지는 경우가 있음
    if (role !== 'audience') {
      initInfo = {
        ...data,
        socket, // ws 대신 socket
        role: data.host ? 'host' : ['blue', 'red'].includes(data.position) ? 'guest' : 'audience',
        hostInfo: { ...data.hostInfo, status: '' },
        guestInfo: { status: '' },
      };
    } else {
      initInfo = {
        ...data,
        socket, // ws 대신 socket
        role: data.host ? 'host' : ['blue', 'red'].includes(data.position) ? 'guest' : 'audience',
      };
    }

    console.log(
      '장담컨데 진짜 최초',
      clients
        .filter((client) => client.roomId === data.roomId)
        .map((v) => ({
          userId: v.userId,
          roomId: v.roomId,
          role: v.role,
          guestInfo: v.guestInfo,
          hostInfo: v.hostInfo,
        })),
    );
    //동일한 방번호가 있을때는 덮어쓰움
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
  });

  socket.on('join', (data) => {
    //대기방에 들어왔을때로 guestinfo나 hostinfo가 join이 됨
    console.log('🚪 Processing join request', JSON.stringify(data));

    roomId = data.roomId;
    userId = data.userId;
    position = data.position;
    host = data.host;
    role = data.role;
    const roomsClient = clients.filter((client) => client.roomId === data.roomId);

    const guestClients = roomsClient.filter((client) => !client.host && client.role === 'guest');
    const audienceClients = roomsClient.filter((client) => !client.host && client.role === 'audience');
    //hostRules로 반대의 정보를 guestinfo로 설정
    let hostRules = roomsClient.find((client) => {
      return client.host;
    });
    //host일때
    if (data.host) {
      roomsClient.forEach((client) => {
        client.hostInfo.status = 'join';
      });
    } else if (hostRules) {
      //guest나 audience일때
      if (guestClients.length > 1) {
        guestClients[1].socket.emit('overCount');
        return;
      }
      
      if (data.role === 'guest') {
        roomsClient.forEach((client) => {
          client.guestInfo.status = 'join';
        });
      }
      const guestItem = roomsClient.find((client) => !client.host && client.role === 'guest');

      roomsClient.forEach((client) => {
        client.banpickMode = hostRules.banpickMode;
        client.peopleMode = hostRules.peopleMode;
        client.timeUnlimited = hostRules.timeUnlimited;
        client.nowSet = hostRules.nowSet;

        client.hostInfo = { ...hostRules.hostInfo };
      });
      roomsClient.forEach((client) => {
        client.guestInfo = {
          status: guestItem?.guestInfo.status??"",
          myTeam: hostRules.hostInfo.yourTeam,
          yourTeam: hostRules.hostInfo.myTeam,
          myTeamSide: hostRules.hostInfo.myTeamSide === 'blue' ? 'red' : 'blue',
          yourTeamSide: hostRules.hostInfo.myTeamSide === 'blue' ? 'blue' : 'red',
          myImg: hostRules.hostInfo.yourImg,
          yourImg: hostRules.hostInfo.myImg,
          host: false,
          role: 'guest',
        };
      });
    } else {
      console.log('❌ No host rules found');
      roomsClient.forEach((client) => {
        client.socket.emit('noRoom');
      });
      return;
    }

    roomsClient.forEach((client) => {
      const { socket, ...sendInfo } = client;
      client.socket.emit('join', {
        ...sendInfo,
        audienceCount: audienceClients.length,
      });
    });

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
  socket.on('closeByHost', (data) => {
    const target = clients.find((c) => c.userId === data.userId);
    console.log(
      'closeByHost',
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
    if (target) {
      clients
        .filter((client) => client.roomId === target.roomId && !client.host)
        .forEach((client) => {
          client.socket.emit('noRoom');
        });
    }
    clients = clients.filter((client) => client.roomId !== target.roomId);

    console.log(target, '??' + data.roomId);
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
      if (role !== 'audience' && !host) {
        console.log('👥 Guest disconnected', userId, position);
        const audienceClients = clients.filter(
          (client) => !client.host && client.roomId === roomId && client.role === 'audience',
        );

        console.log('👥 Guest disconnected1', userId, position);
        clients
          .filter((client) => client.roomId === roomId)
          .forEach((client) => {
            client.guestInfo.status = '';
          });

        console.log('👥 Guest disconnected2', userId, position);
        clients
          .filter((client) => client.roomId === roomId)
          .forEach((client) => {
            const { socket, ...sendInfo } = client;
            client.socket.emit('closeByGuest', {
              ...sendInfo,
              audienceCount: audienceClients.length,
            });
          });

        console.log('👥 Guest disconnected3', userId, position);
        clients = clients.filter((client) => client.userId !== userId);
        console.log('👥 Guest disconnected4', userId, position);
      } else if (role === 'audience') {
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
