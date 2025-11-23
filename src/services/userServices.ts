import api from "@/lib/api";

/**
 * Create a new cashier account
 * POST /api/admin/users/cashier
 */
export const createCashier = async (
    payload: {
        name: string;
        email: string;
        password: string;
    }
): Promise<{
    success: boolean;
    user: ICashier;
}> => {
    const res = await api.post("/admin/users/cashier", payload);
    return res.data;
};

/**
 * List all cashiers with pagination
 * GET /api/admin/users/cashiers?page=&limit=
 */
export const listCashiers = async (
    page = 1,
    limit = 10
): Promise<{
    success: boolean;
    data: ICashier[];
    total: number;
}> => {
    const res = await api.get("/admin/users/cashiers", {
        params: { page, limit },
    });
    return res.data;
};

/**
 * Update cashier details (name/email)
 * PATCH /api/admin/users/cashier/:id
 */
export const updateCashier = async (
    id: string,
    payload: {
        name?: string;
        email?: string;
    }
): Promise<{
    success: boolean;
    user: ICashier;
}> => {
    const res = await api.patch(`/admin/users/cashier/${id}`, payload);
    return res.data;
};

/**
 * Enable or disable cashier
 * PATCH /api/admin/users/cashier/:id/status
 */
export const setCashierStatus = async (
    id: string,
    status: "active" | "inactive"
): Promise<{
    success: boolean;
    message: string;
}> => {
    const res = await api.patch(`/admin/users/cashier/${id}/status`, {
        status,
    });
    return res.data;
};

/**
 * Get login/logout history for a cashier
 * GET /api/admin/users/cashier/:id/history
 */
export const getCashierHistory = async (
    id: string
): Promise<ICashierHistoryResponse> => {
    const res = await api.get(`/admin/users/cashier/${id}/history`);
    return res.data;
};

/**
 * Reset cashier password (admin)
 * PATCH /admin/users/cashier/:id/reset-password
 */
export const resetCashierPassword = async (
    id: string
): Promise<{ success: boolean; message: string; temporaryPassword: string }> => {
    const res = await api.patch(`/admin/users/cashier/${id}/reset-password`);
    return res.data;
};

/**
 * Get cashier statistics (dashboard)
 * GET /api/admin/users/cashier/stats
 */
export const getUserStats = async (): Promise<{
    success: boolean;
    stats: IUserStats;
}> => {
    const res = await api.get("/admin/users/cashier/stats");
    return res.data;
};