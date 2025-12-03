// lib/socket.ts
import { io, Socket } from "socket.io-client";

export const socket: Socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
    transports: ["websocket"],
    withCredentials: true,
    autoConnect: false,
});

socket.on("connect_error", (err) => {
    console.error("Socket connection failed:", err.message);
});
