"use client";

import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { socket as baseSocket } from "@/lib/socket";

type SocketContextValue = { socket: Socket | null };

const SocketContext = createContext<SocketContextValue>({ socket: null });

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      baseSocket.disconnect();
      return;
    }

    if (!baseSocket.connected) {
      baseSocket.connect();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket: user ? baseSocket : null }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext).socket;
}
