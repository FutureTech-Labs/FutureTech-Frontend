"use client";

import { useRouter } from "next/navigation";
import { getMe, logout as logoutService } from "../services/authService";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { toast } from "sonner";
import { socket } from "@/lib/socket";
import { useNotificationStore } from "./NotificationStore";
import { fetchNotifications } from "@/services/notificationService";

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [ready, setReady] = useState(false);

    const addNotification = useNotificationStore((s) => s.addNotification);
    const setNotifications = useNotificationStore((s) => s.setNotifications);

    useEffect(() => {
        refreshUser();
    }, []);

    // SOCKET.IO INIT
    useEffect(() => {
        if (!ready) return;

        if (!user?.id) return;

        // Join room
        console.log("JOINING ROOM:", user.id);
        socket.emit("joinRoom", user.id);

        // Load old notifications
        fetchNotifications().then((items) => setNotifications(items));

        // Real-time listener
        socket.on("notification", (notif) => {
            console.log("RECEIVED SOCKET NOTIFICATION:", notif);

            addNotification(notif);

            toast(notif.message);

            const audio = new Audio("/sounds/notification.mp3");
            audio.play();
        });

        return () => {
            socket.off("notification");
        };
    }, [ready, user]);


    const refreshUser = async () => {
        setLoading(true);
        try {
            const res = await getMe();
            if (res.success) setUser(res.user);
            else setUser(null);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
            setReady(true); 
        }

    };

    const logout = async () => {
        await logoutService();
        setUser(null);
        router.replace("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
