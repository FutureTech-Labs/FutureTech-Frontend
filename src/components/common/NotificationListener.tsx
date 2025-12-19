"use client";

import {
    useEffect,
    useRef
} from "react";

import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { useNotificationStore } from "@/context/NotificationStore";
import { fetchNotifications } from "@/services/notificationService";

export default function NotificationListener() {
    const socket = useSocket();
    const { user } = useAuth();

    const addNotification = useNotificationStore((s) => s.addNotification);
    const setNotifications = useNotificationStore((s) => s.setNotifications);

    // Initial fetch runs ONCE after login
    const didInitFetch = useRef(false);

    useEffect(() => {
        if (!user || didInitFetch.current) return;

        didInitFetch.current = true;

        fetchNotifications().then((items) => {
            setNotifications(items);
        });
    }, [user, setNotifications]);

    // Live real-time notifications
    useEffect(() => {
        if (!socket) return;

        const handler = (notif: any) => {
            addNotification(notif);
            toast(notif.message);

            try {
                new Audio("/sounds/notification.mp3").play();
            } catch { }
        };

        socket.on("notification", handler);

        return () => {
            socket.off("notification", handler);
        };
    }, [socket, addNotification]);


    return null;
}
