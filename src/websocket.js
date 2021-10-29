import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const websocketContext = createContext({});

export function WebsocketProvider(props) {
  const { children } = props;

  const [status, setStatus] = useState("IDLE");

  /** @type {import("react").MutableRefObject<WebSocket | undefined>} */
  const socket = useRef(undefined);
  const [callbacks, setCallbacks] = useState([]);

  useEffect(() => {
    if (socket.current) {
      socket.current.close();
      socket.current = undefined;
    }

    socket.current = new WebSocket(`ws://localhost:3001/api/ws`);
    console.log(`Connecting to: ws://localhost:3001/api/ws`);

    function onOpenHandler() {
      console.log("open!");
      setStatus("CONNECTED");
    }

    function onCloseHandler() {
      console.log("close!");
      setStatus("DISCONNECTED");
    }

    socket.current.addEventListener("open", onOpenHandler);
    socket.current.addEventListener("close", onCloseHandler);

    return () => {
      socket.current.removeEventListener("open", onOpenHandler);
      socket.current.removeEventListener("close", onCloseHandler);
    };
  }, []);

  useEffect(() => {
    // Nothing to do
    if (status !== "CONNECTED") {
      return () => {};
    }

    function handler(evt) {
      console.log(callbacks.length);
      for (const { cb } of callbacks) {
        cb(evt.data);
      }
    }

    socket.current.addEventListener("message", handler);

    return () => {
      socket.current.removeEventListener("message", handler);
    };
  }, [callbacks, status]);

  const addCallback = useCallback((cb) => {
    const id = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);

    setCallbacks((prev) => [...prev, { id, cb }]);
    return id;
  }, []);

  const value = useMemo(
    () => ({
      status,

      sendMessage: (message) => {
        console.log(message);
        if (status === "CONNECTED") {
          socket.current.send(message);
        }
      },

      addCallback,

      removeCallback: (id) => {
        setCallbacks((prev) => prev.filter((cb) => cb.id != id));
      },
    }),
    [status, addCallback]
  );

  return (
    <websocketContext.Provider value={value}>
      {children}
    </websocketContext.Provider>
  );
}

export function useWebsocket() {
  const { addCallback, removeCallback, status, sendMessage } =
    useContext(websocketContext);

  return {
    status,
    addCallback,
    removeCallback,
    sendMessage,
  };
}
