
export default function useConnectStatus(ws: WebSocket) {
  const [readyState, setReadyState] = useState(ws.readyState);
  const [stateName, setStateName] = useState('');

  useEffect(() => {

    function handleOnOpen() {
      setReadyState(ws.readyState);
    }

    function handleOnClose() {
      setReadyState(ws.readyState);
    }

    ws.addEventListener('open', handleOnOpen);
    ws.addEventListener('close', handleOnClose);

    console.log('ws state event listener added');

    return () => {
      ws.removeEventListener('open', handleOnOpen);
      ws.removeEventListener('close', handleOnClose);
      console.log('ws state event listener removed');
    }

  }, []);

  useEffect(() => {
    setStateName(['连接中', '已连接', '断开中', '已断开'][readyState]);
  }, [readyState]);

  return stateName;
}