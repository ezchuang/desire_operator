import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import io, { Socket } from "socket.io-client";

interface ISocketContext {
  socket: Socket | null;
  // eslint-disable-next-line no-unused-vars
  initializeSocket: (token: string) => void;
  disconnectSocket: () => void;
}

const defaultSocketContext: ISocketContext = {
  socket: null,
  initializeSocket: () => {},
  disconnectSocket: () => {},
};

const SocketContext = createContext<ISocketContext>(defaultSocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const initializeSocket = (token: string) => {
    const newSocket = io("/", {
      query: { token },
    });

    newSocket.on("connect", () => console.log("Connected to server"));
    newSocket.on("disconnect", () => console.log("Disconnected from server"));

    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  // 此 Component 結束時將 連線終結
  // but 此為 useContext，此環節應該不作用
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket, initializeSocket, disconnectSocket }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
