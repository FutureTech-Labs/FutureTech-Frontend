"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { socket } from "@/lib/socket";
import { useNotificationStore } from "@/context/NotificationStore";
import { fetchNotifications } from "@/services/notificationService";

export default function SocketMount({ userId }: { userId: string }) {
    // console.log("SocketMount mounted with userId =", userId);

    const addNotification = useNotificationStore((s) => s.addNotification);
    const setNotifications = useNotificationStore((s) => s.setNotifications);

    // Prevents fetchNotifications running twice due to React StrictMode
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (!userId) {
            console.log("No userId, skipping joinRoom");
            return;
        }

        console.log("JOINING ROOM FROM SOCKET MOUNT:", userId);
        socket.emit("joinRoom", userId);

        // Fetch notifications once
        if (!fetchedRef.current) {
            fetchedRef.current = true;
            fetchNotifications().then((items) => {
                console.log("Loaded notifications:", items);
                setNotifications(items);
            });
        }

        // Prevent multiple listeners
        const listener = (notif: any) => {
            console.log("RECEIVED SOCKET NOTIFICATION:", notif);

            addNotification(notif);
            toast(notif.message);
            new Audio("/sounds/notification.mp3").play();
        };

        // Attach listener
        socket.on("notification", listener);

        return () => {
            console.log("SocketMount cleanup triggered");
            socket.off("notification", listener);
        };
    }, [userId, addNotification, setNotifications]);

    return null;
};