'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useBanStore, usePopupStore, useRulesStore, useSocketStore, useUserStore } from '@/store';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { usePeerlessStore } from '@/store/banpick';
import {
  banPickModeOptions,
  InitailizeInfoData,
  lineMappingOptions,
  navigations,
  roleOptions,
  socketType,
  statusOptions,
  teamcolorOptions,
} from '@/constants';

function useBanpickSocket({ userId: _userId, roomId }: { userId: string; roomId: string }) {
  const { setIsOpen, setBtnList, setContent } = usePopupStore();
  const { setUserId } = useUserStore();
  const { setRoomId, setSocket } = useSocketStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const {
    setRules,
    setHostRules,
    setGuestRules,
    hostInfo,
    banpickMode,
    peopleMode,
    timeUnlimited,
    nowSet,
    position,
    audienceCount,
    setPeerlessSet,
    setChangeTeam,
    setCurrentSelectedPick,
    setBanPickObject,
    setChangeChampionInfo,
    setCurrentLocation,
    setSelectedTeamIndex,
    setClearBanPickObject,
    setClearSelectTeamIndex,
    setClearCurrentLocation,
    setHeaderSecond,
    setTeamBan,
    setBlueBan,
    setRedBan,
    setBlueBanClear,
    setRedBanClear,
  } = { ...useRulesStore(), ...useBanStore(), ...usePeerlessStore() };

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (pathName !== '/' && !roomId && !searchParams.get('roomId')) {
      setIsOpen(true);
      setContent('공유된 게임이 없습니다.');
      setBtnList([
        {
          text: '돌아가기',
          func: () => {
            setIsOpen(false);
            router.push('/');
          },
        },
      ]);
    }
  }, [pathName]);

  const setSocketFunc = async () => {
    if (socketRef.current) return;

    const userId = _userId;
    setUserId(userId);

    const roomIdValue = searchParams.get('roomId') ?? roomId;
    const positionValue = (searchParams.get('position') as 'blue' | 'red' | 'audience') ?? position;
    const isHost = !searchParams.get('position');

    setRules({
      banpickMode,
      peopleMode,
      timeUnlimited,
      nowSet,
      audienceCount,
      position: positionValue,
      role: isHost ? roleOptions.HOST : positionValue === roleOptions.AUD ? roleOptions.AUD : roleOptions.GUEST,
    });

    if (!roomIdValue) return;

    setRoomId(roomIdValue);

    const response = await fetch('/api/socket/io');
    const { socketUrl } = await response.json();

    const socket = io(socketUrl, {
      transports: ['websocket'],
      reconnection: false, //
    }) as Socket;

    socketRef.current = socket;
    setSocket(socket as any);

    socket.on('connect', () => {
      if (isHost && pathName === '/') {
        socket.emit(socketType.INIT, {
          type: socketType.INIT,
          userId: localStorage.getItem('lol_ban_host_id') as string,
          roomId: `${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}`,
          banpickMode,
          peopleMode,
          timeUnlimited,
          nowSet,
          hostInfo,
          host: true,
          role: roleOptions.HOST,
          position: `${searchParams!.get('position') ? searchParams!.get('position') : position}`,
        });
      } else if (pathName !== '/' && roomId && !searchParams?.get('roomId')) {
        socket.emit(socketType.JOIN, {
          userId: _userId,
          roomId: `${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}`,
          banpickMode,
          peopleMode,
          timeUnlimited,
          nowSet,
          hostInfo,
          host: true,
          role: roleOptions.HOST,
          position: `${searchParams!.get('position') ? searchParams!.get('position') : position}`,
        });
      } else {
        socket.emit(socketType.INIT, {
          type: socketType.INIT,
          userId: userId,
          roomId: `${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}`,
          host: false,
          position: `${searchParams!.get('position') ? searchParams!.get('position') : position}`,
          role:
            (searchParams!.get('position') as 'blue' | 'red' | 'audience') === roleOptions.AUD
              ? roleOptions.AUD
              : roleOptions.GUEST,
        });
        socket.emit(socketType.JOIN, {
          type: socketType.JOIN,
          roomId: `${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}`,
          userId,
          role:
            (searchParams!.get('position') as 'blue' | 'red' | 'audience') === roleOptions.AUD
              ? roleOptions.AUD
              : roleOptions.GUEST,
        });
      }
    });

    socket.on(socketType.READY, (data) => {
      setHostRules(data.hostInfo);
      setGuestRules(data.guestInfo);
    });

    socket.on(socketType.READYCANCEL, (data) => {
      setHostRules(data.hostInfo);
      setGuestRules(data.guestInfo);
    });

    socket.on(socketType.BANPICKSTART, () => {
      router.push(navigations.BANPICKTEAM);
    });

    socket.on(socketType.JOIN, (data) => {
      setRules(data);
      setHostRules(data.hostInfo);
      setGuestRules(data.guestInfo);
    });

    socket.on(socketType.CLOSEBYHOST, () => {
      setIsOpen(true);
      setContent('게임 주최자가 게임을 종료했습니다.');
      setBtnList([
        {
          text: '돌아가기',
          func: () => {
            setIsOpen(false);
            router.push('/');
          },
        },
      ]);
    });

    socket.on(socketType.CLOSESHAREPOP, (data) => {
      setIsOpen(true);
      setContent('게임 주최자가 게임을 종료했습니다.');
      setBtnList([
        {
          text: '돌아가기',
          func: () => {
            setIsOpen(false);
            router.push('/');
          },
        },
      ]);
    });
    socket.on('closeByGuest', (data) => {
      setRules(data);
      setHostRules(data.hostInfo);
      setGuestRules(data.guestInfo);
    });

    socket.on('closeByAudience', (data) => {
      setRules({
        banpickMode,
        peopleMode,
        timeUnlimited,
        role: 'audience',
        position,
        audienceCount: data.audienceCount,
        nowSet,
      });
    });

    socket.on('overCount', () => {
      setIsOpen(true);
      setContent('정원이 초과 되었습니다');
      setBtnList([
        {
          text: '돌아가기',
          func: () => {
            setIsOpen(false);
            router.push('/');
          },
        },
      ]);
    });

    socket.on(socketType.NOROOM, () => {
      setIsOpen(true);
      setContent('공유된 게임이 없습니다.');
      setBtnList([
        {
          text: '돌아가기',
          func: () => {
            setIsOpen(false);
            router.push('/');
          },
        },
      ]);
    });

    socket.on(socketType.IMAGE, (data) => {
      setCurrentSelectedPick(data.params.name, data.params.info);
    });

    socket.on(socketType.CHAMPION, () => {
      const { banpickMode } = useRulesStore.getState();
      const { banPickObject, currentLocation, selectedTeamIndex, selectedTeam, currentSelectedPick } =
        useBanStore.getState();

      let index = banPickObject.find((v) => v.location === currentLocation)?.index as number;
      setBanPickObject(index, currentSelectedPick[0].name, currentSelectedPick[0].info, false);
      setChangeChampionInfo(currentSelectedPick[0].name, selectedTeam[selectedTeamIndex].banpick);

      if (banpickMode !== banPickModeOptions.TNM) {
        const selectedChampion = {
          name: currentSelectedPick[0].name,
          info: currentSelectedPick[0].info,
          line: lineMappingOptions[selectedTeam[selectedTeamIndex].line] ?? -1,
        };

        if (
          selectedTeam[selectedTeamIndex].banpick === statusOptions.PICK &&
          selectedTeam[selectedTeamIndex].color === teamcolorOptions.BLUE
        ) {
          setBlueBan(selectedChampion);
        } else if (
          selectedTeam[selectedTeamIndex].banpick === statusOptions.PICK &&
          selectedTeam[selectedTeamIndex].color === teamcolorOptions.RED
        ) {
          setRedBan(selectedChampion);
        }
      }
      index += 1;
      setCurrentLocation(index);
      setCurrentSelectedPick('', InitailizeInfoData);
      setSelectedTeamIndex();
    });

    socket.on(socketType.RANDOM, (data) => {
      const { banPickObject, currentLocation, selectedTeamIndex, selectedTeam } = useBanStore.getState();
      const { banpickMode } = useRulesStore.getState();
      let index = banPickObject.find((v) => v.location === currentLocation)?.index as number;

      if (banpickMode !== banPickModeOptions.TNM) {
        const selectedChampion = {
          name: data.data.randomName,
          info: data.data.newRandomInfo,
          line: lineMappingOptions[selectedTeam[selectedTeamIndex].line] ?? -1,
        };

        if (
          selectedTeam[selectedTeamIndex].banpick === statusOptions.PICK &&
          selectedTeam[selectedTeamIndex].color === teamcolorOptions.BLUE
        ) {
          setBlueBan(selectedChampion);
        } else if (
          selectedTeam[selectedTeamIndex].banpick === statusOptions.PICK &&
          selectedTeam[selectedTeamIndex].color === teamcolorOptions.RED
        ) {
          setRedBan(selectedChampion);
        }
      }
      setBanPickObject(index, data.data.randomName, data.data.newRandomInfo, true); // 랜덤 챔피언을 선택해준다
      if (selectedTeam[selectedTeamIndex].banpick === statusOptions.PICK) {
        setChangeChampionInfo(data.data.randomName, selectedTeam[selectedTeamIndex].banpick); // 현재 선택된 챔피언의 status 변경
      }

      index += 1;
      setCurrentLocation(index); // 다음 위치를 저장한다
      setCurrentSelectedPick('', InitailizeInfoData); // 초기화
      setSelectedTeamIndex(); // 헤더 변경을 위한 Index값 수정
      setHeaderSecond('30');
    });

    socket.on(socketType.PEERLESS, () => {
      const { blueBan, redBan } = usePeerlessStore.getState();
      setTeamBan(blueBan, redBan);
      setBlueBanClear();
      setRedBanClear();
    });

    socket.on(socketType.CLEARTEAMPEERLESS, () => {
      setPeerlessSet();
      setClearBanPickObject();
      setClearSelectTeamIndex();
      setClearCurrentLocation();
      router.refresh();
    });

    socket.on(socketType.TEAMCHANGE, () => {
      setChangeTeam();
    });

    socket.on('connect_error', (err) => {
      // console.error('❗ 소켓 연결 에러', err);
    });

    socket.on('disconnect', () => {
      // console.log('❌ 소켓 연결 끊김');
    });
  };

  return { setSocketFunc };
}

export default useBanpickSocket;
