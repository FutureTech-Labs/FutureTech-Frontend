import { create } from "zustand";

export interface INotification {
    _id: string;
    message: string;
    type: string;
    createdAt: string;
    isRead: boolean;
}

interface NotificationState {
    notifications: INotification[];
    unreadCount: number;

    setNotifications: (items: INotification[]) => void;
    addNotification: (n: INotification) => void;
    markRead: (id: string) => void;
    markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,

    setNotifications: (items) =>
        set({
            notifications: items,
            unreadCount: items.filter((n) => !n.isRead).length,
        }),

    addNotification: (n) =>
        set((state) => {
            if (state.notifications.some((x) => x._id === n._id)) {
                return state;
            }

            return {
                notifications: [n, ...state.notifications],
                unreadCount: state.unreadCount + 1,
            };
        }),

    markRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n._id === id ? { ...n, isRead: true } : n
            ),
            unreadCount: state.notifications.filter((n) => !n.isRead && n._id !== id).length,
        })),

    markAllRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
            unreadCount: 0,
        })),
}));
