"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { socket as baseSocket } from "@/lib/socket";

type SocketContextValue = { socket: Socket | null };

const SocketContext = createContext<SocketContextValue>({ socket: null });

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // No logged-in user → ensure socket stays disconnected
    if (!user) {
      if (baseSocket.connected) baseSocket.disconnect();
      setSocket(null);
      return;
    }

    // Attach listener before connecting
    const handleConnect = () => {
      /* silent success */
    };

    baseSocket.on("connect", handleConnect);

    // Connect only once
    if (!baseSocket.connected) {
      baseSocket.connect();
    }

    setSocket(baseSocket);

    return () => {
      baseSocket.off("connect", handleConnect);

      if (baseSocket.connected) {
        baseSocket.disconnect();
      }

      setSocket(null);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext).socket;
}
