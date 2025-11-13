import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
    transports: ["websocket"],
    withCredentials: true,
});

socket.on("connect", () => {
    console.log("SOCKET CONNECTED:", socket.id);
});

socket.on("connect_error", (err) => {
    console.error("SOCKET CONNECT ERROR:", err);
});
