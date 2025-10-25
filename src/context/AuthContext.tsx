"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getMe, logout as logoutService } from "../services/authService";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "cashier";
    status: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        refreshUser();
    }, []);

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
