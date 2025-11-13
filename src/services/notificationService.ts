import apiClient from "@/lib/api";

export const fetchNotifications = async () => {
    const res = await apiClient.get("/shared/notify/me");
    return res.data.notifications;
};

export const markNotificationRead = async (id: string) => {
    return apiClient.patch(`/shared/notify/read/${id}`);
};

export const markAllRead = async () => {
    return apiClient.patch("/shared/notify/read-all");
};
