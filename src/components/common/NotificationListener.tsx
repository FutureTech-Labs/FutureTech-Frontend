"use client";

import {
    useEffect
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

    // Load stored notifications after login
    useEffect(() => {
        if (!user) return;

        fetchNotifications().then((items) => {
            setNotifications(items);
        });
    }, [user]);

    // Live real-time notifications
    useEffect(() => {
        if (!socket) return;

        const handler = (notif: any) => {
            addNotification(notif);
            toast(notif.message);

            // Play sound
            try {
                new Audio("/sounds/notification.mp3").play();
            } catch { }
        };

        socket.on("notification", handler);

        return () => {
            socket.off("notification", handler);
        };
    }, [socket]);

    return null; // No UI, just a background listener
}
