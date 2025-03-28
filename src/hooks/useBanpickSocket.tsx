import { useEffect, useRef } from 'react';
import { useBanStore, usePopupStore, useRulesStore, useSocketStore, useUserStore } from '@/store';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { InfoData, usePeerlessStore } from '@/store/banpick';

function useBanpickSocket({ userId: _userId, roomId }: { userId: string; roomId: string }) {
  const { setIsOpen, setBtnList, setContent } = usePopupStore();
  useRulesStore();
  const {
    setCurrentSelectedPick,
    setBanPickObject,
    setChangeChampionInfo,
    setCurrentLocation,
    setSelectedTeamIndex,
    setClearBanPickObject,
    setClearSelectTeamIndex,
    setClearCurrentLocation,
  } = useBanStore();
  const { setTeamBan, setBlueBan, setRedBan, setRedBanClear, setBlueBanClear } = usePeerlessStore();

  //room id
  const { setRoomId, ws, setWs } = useSocketStore();
  //user id
  const { setUserId } = useUserStore();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const {
    role,
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
  } = useRulesStore();
  const socketRef = useRef<WebSocket | null>(null);
  const lineMapping: Record<string, number> = {
    top: 0,
    jungle: 1,
    mid: 2,
    ad: 3,
    sup: 4,
  };

  useEffect(() => {
    if (pathName !== '/' && !roomId && !searchParams?.get('roomId')) {
      console.log(`📩 새 메시지: noRoom`);
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
    } else if (pathName !== '/' && roomId && !searchParams?.get('roomId')) {
      ws?.send(
        JSON.stringify({
          type: 'join',
          userId: _userId,
          roomId: `${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}`,
          banpickMode,
          peopleMode,
          timeUnlimited,
          nowSet,
          hostInfo,
          host: true,
          role: 'host',
          position: `${searchParams!.get('position') ? searchParams!.get('position') : position}`,
        }),
      );
    }
  }, [pathName]);

  const setSocket = () => {
    // WebSocket이 연결되지 않으면 새로 연결 시도
    if (socketRef.current) return;
    if (ws && !searchParams?.get(roomId)) return;
    if (!socketRef.current && !ws) {
      console.log(_userId, 'userid');
      const userId = _userId;
      setUserId(_userId);
      //host 는 postion 을 던져주지 않음
      const positionValue = (searchParams!.get('position') as 'blue' | 'red' | 'audience') ?? position;

      setRules({
        banpickMode,
        peopleMode,
        timeUnlimited,
        nowSet,
        audienceCount,
        position: positionValue,
        //role 설정
        role: !searchParams!.get('position')
          ? 'host'
          : (searchParams!.get('position') as 'blue' | 'red' | 'audience') === 'audience'
            ? 'audience'
            : 'guest',
      });
      const connectWebSocket = async () => {
        if (searchParams!.get('roomId')) setRoomId(searchParams!.get('roomId') as string);
        // WebSocket 서버 URL 가져오기
        const response = await fetch('/api/socket/io');
        const { wsUrl } = await response.json();

        if (!response.ok) throw new Error('WebSocket server not ready');

        // WebSocket 연결 파라미터
        const params = new URLSearchParams({
          roomId: searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId,
          userId: userId,
          position: searchParams!.get('position') ? searchParams!.get('position') : position,
          host: String(searchParams!.get('position') ? false : true),
        });

        const _ws = new WebSocket(`${wsUrl}?${params.toString()}`);
        setWs(_ws);

        _ws.onopen = () => {
          console.log(
            '✅ WebSocket connected' +
              `userId${userId}roomId` +
              `${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}`,
          );
          if (!searchParams!.get('position')) {
            //host일때 (sharePop.tsx에서 메인 페이지에서 가장 먼저 세팅됨)
            console.log(hostInfo, 'hostInfo');
            if (pathName === '/') {
              //초기 화면 소켓 실행
              _ws?.send(
                JSON.stringify({
                  type: 'init',
                  userId: localStorage.getItem('lol_ban_host_id') as string,
                  roomId: `${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}`,
                  banpickMode,
                  peopleMode,
                  timeUnlimited,
                  nowSet,
                  hostInfo,
                  host: true,
                  role: 'host',
                  position: `${searchParams!.get('position') ? searchParams!.get('position') : position}`,
                }),
              );
            }
          } else {
            //이후에 접속된 guest나 관중

            _ws?.send(
              JSON.stringify({
                type: 'init',
                userId: userId,
                roomId: `${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}`,
                host: false,
                position: `${searchParams!.get('position') ? searchParams!.get('position') : position}`,
                role:
                  (searchParams!.get('position') as 'blue' | 'red' | 'audience') === 'audience' ? 'audience' : 'guest',
              }),
            );

            _ws?.send(
              JSON.stringify({
                type: 'join',
                roomId: `${searchParams!.get('roomId') ? searchParams!.get('roomId') : roomId}`,
                userId,
                role:
                  (searchParams!.get('position') as 'blue' | 'red' | 'audience') === 'audience' ? 'audience' : 'guest',
              }),
            );
          }
        };
        _ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          // 메시지 타입에 따라 알림을 띄움
          // 페이지 별로 이벤트 추가 필요

          if (data.type === 'init') {
            console.log(`📩 새 메시지: ${JSON.stringify(data)}`);
          }
          if (data.type === 'ready') {
            console.log(`📩 새 메시지: ${JSON.stringify(data)}`);
            setHostRules(data.hostInfo);
            setGuestRules(data.guestInfo);
          }
          if (data.type === 'banpickStart') {
            console.log(`📩 새 메시지: ${JSON.stringify(data)}`);
            router.push('/banpickTeam');
          }
          if (data.type === 'on') {
            console.log(`📩 새 메시지: ${JSON.stringify(data)}`);
          }
          if (data.type === 'join') {
            console.log(`📩 새 메시지: ${JSON.stringify(data)}`);
            setRules(data);
            setHostRules(data.hostInfo);
            setGuestRules(data.guestInfo);
          }

          if (data.type === 'closeByHost') {
            console.log(`📩 새 메시지: 종료`);
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
          }
          if (data.type === 'closeByGuest') {
            console.log(data, 'closeByGuest');
            setRules(data);
            setHostRules(data.hostInfo);
            setGuestRules(data.guestInfo);
          }
          if (data.type === 'closeByAudience') {
            console.log(`📩 closeByAudience`, data);
            setRules({
              banpickMode,
              peopleMode,
              timeUnlimited,
              role,
              position,
              audienceCount: data.audienceCount,
              nowSet,
            });
          }
          if (data.type === 'overCount') {
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
          }
          if (data.type === 'noRoom') {
            console.log(`📩 새 메시지: noRoom`);
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
          if (data.type === 'image') {
            setCurrentSelectedPick(data.params.name, data.params.info);
          }
          if (data.type === 'champion') {
            const { banPickObject, currentLocation, selectedTeamIndex, selectedTeam, currentSelectedPick } =
              useBanStore.getState();
            const { banpickMode } = useRulesStore.getState();

            let index = banPickObject.find((value) => value.location === currentLocation)?.index as number;
            // 현재 밴픽 정보를 바꿔준다.
            setBanPickObject(index, currentSelectedPick[0].name, currentSelectedPick[0].info, false);
            // 챔피언 정보를 바꿔준다.
            setChangeChampionInfo(currentSelectedPick[0].name, selectedTeam[selectedTeamIndex].banpick);
            // 피어리스 일 경우
            if (banpickMode !== 'tournament') {
              if (selectedTeam[selectedTeamIndex].banpick === 'pick') {
                const selectedChampion = {
                  name: currentSelectedPick[0].name,
                  info: currentSelectedPick[0].info,
                  line: lineMapping[selectedTeam[selectedTeamIndex].line] ?? -1,
                };
                if (selectedTeam[selectedTeamIndex].color === 'blue') {
                  setBlueBan(selectedChampion);
                } else {
                  setRedBan(selectedChampion);
                }
              }
            }

            index += 1;

            // 밴픽 위치를 다음으로 변경해준다. 그리고 현재선택이미지 초기화
            setCurrentLocation(index);
            setCurrentSelectedPick('', InfoData);
            setSelectedTeamIndex();
          }
          if (data.type === 'random') {
            const { banPickObject, currentLocation, selectedTeamIndex, selectedTeam } = useBanStore.getState();
            let index = banPickObject.find((value) => value.location === currentLocation)?.index as number;

            if (selectedTeam[selectedTeamIndex].banpick === 'ban') {
              setBanPickObject(index, data.data.randomName, data.data.randomInfo, true); // 랜덤 챔피언을 선택해준다
            } else {
              setBanPickObject(index, data.data.randomName, data.data.randomInfo, true); // 랜덤 챔피언을 선택해준다
              setChangeChampionInfo(data.data.randomName, selectedTeam[selectedTeamIndex].banpick); // 현재 선택된 챔피언의 status 변경
            }

            index += 1;
            setCurrentLocation(index); // 다음 위치를 저장한다
            setCurrentSelectedPick('', InfoData); // 초기화
            setSelectedTeamIndex(); // 헤더 변경을 위한 Index값 수정
          }
          if (data.type === 'Peerless') {
            const { blueBan, redBan } = usePeerlessStore.getState();
            setTeamBan(blueBan, redBan);
            setRedBanClear();
            setBlueBanClear();
          }
          if (data.type === 'clearPeerless') {
            setPeerlessSet();
            setClearBanPickObject();
            setClearSelectTeamIndex();
            setClearCurrentLocation();
            router.refresh();
          }
        };

        _ws.onerror = (error) => console.error('❌ WebSocket error:', error);
        _ws.onclose = () => console.log('❌ WebSocket disconnected');

        socketRef.current = _ws;
      };

      connectWebSocket();
    }
    return () => {
      if (ws) {
        console.log(ws);
        ws!.close();
      }
    };
  };
  return { setSocket };
}

export default useBanpickSocket;
