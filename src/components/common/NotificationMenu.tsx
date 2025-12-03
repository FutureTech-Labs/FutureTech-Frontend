"use client";

import { Bell, CheckCheck, Dot } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useNotificationStore } from "@/context/NotificationStore";
import {
    markNotificationRead,
    markAllRead as markAllReadService
} from "@/services/notificationService";

export default function NotificationMenu() {
    const {
        notifications,
        unreadCount,
        markRead,
        markAllRead: markAllLocal,
    } = useNotificationStore();

    const handleMarkRead = async (id: string) => {
        await markNotificationRead(id);   // backend first
        markRead(id);                     // then update UI
    };

    const handleMarkAll = async () => {
        await markAllReadService();       // backend first
        markAllLocal();                   // then update UI
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full md:h-10 md:w-10 w-8 h-8 button-gradient border-t-2 border-white/30 hover:bg-white/10 text-white disable-ring"
                >
                    <Bell size={20} />

                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="md:w-80 w-72 mt-2 rounded-xl shadow-lg border border-white/10 backdrop-blur-xl bg-black/70"
            >
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3">
                    <DropdownMenuLabel className="text-sm font-semibold text-white">
                        Notifications
                    </DropdownMenuLabel>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAll}
                            className="text-xs text-blue-400 hover:text-blue-300 transition"
                        >
                            Mark all read
                        </button>
                    )}
                </div>

                <DropdownMenuSeparator className="bg-white/10" />

                {/* Empty State */}
                {notifications.length === 0 && (
                    <div className="text-sm text-gray-400 px-4 py-6 text-center">
                        No notifications yet
                    </div>
                )}

                {/* Notifications */}
                <div className="max-h-80 overflow-y-auto px-2">
                    {notifications.map((n) => {
                        const isUnread = !n.isRead;

                        const color =
                            n.type === "success"
                                ? "text-green-400"
                                : n.type === "warning"
                                    ? "text-yellow-400"
                                    : n.type === "error"
                                        ? "text-red-400"
                                        : "text-blue-400";

                        return (
                            <DropdownMenuItem
                                key={n._id}
                                onClick={() => handleMarkRead(n._id)}
                                className={cn(
                                    "flex items-start gap-3 px-3 py-3 rounded-lg cursor-pointer transition",
                                    "hover:bg-white/5",
                                    isUnread && "bg-white/5 border border-white/10"
                                )}
                            >
                                <Dot className={cn("w-5 h-5 mt-1", color)} />

                                <div className="flex-1 text-[13px] leading-tight text-gray-200">
                                    <div className={cn(isUnread && "font-semibold text-white")}>
                                        {n.message}
                                    </div>

                                    <div className="text-[11px] text-gray-400 mt-1">
                                        {new Date(n.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                {isUnread ? (
                                    <CheckCheck className="w-4 h-4 text-blue-400" />
                                ) : (
                                    <span className="text-gray-600 text-xs">Read</span>
                                )}
                            </DropdownMenuItem>
                        );
                    })}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
