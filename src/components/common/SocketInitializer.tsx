"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useNotificationStore } from "@/context/NotificationStore";

export default function SocketInitializer({ userId }: { userId: string }) {
    const addNotification = useNotificationStore((s) => s.addNotification);

    useEffect(() => {
        if (!userId) return;

        // Join room with MongoDB userId
        socket.emit("joinRoom", userId);

        // Listen for incoming notifications
        socket.on("notification", (notif) => {
            console.log("New Notification:", notif);
            addNotification(notif);
        });

        return () => {
            socket.off("notification");
        };
    }, [userId]);

    return null;
}
