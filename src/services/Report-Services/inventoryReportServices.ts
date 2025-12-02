import api from "@/lib/api";

// ==============================
// 1. Current Stock Report
// GET /admin/report/inventory/current-stock
// ==============================
export const getCurrentStockReport = async (
    params?: { page?: number; limit?: number; search?: string }
): Promise<ICurrentStockResponse> => {
    const { data } = await api.get<ICurrentStockResponse>(
        "/admin/report/inventory/current-stock",
        { params }
    );
    return data;
};

// ==============================
// 2. Low Stock Report
// GET /admin/report/inventory/low-stock
// ==============================
export const getLowStockReport = async (
    params?: { page?: number; limit?: number; search?: string; threshold?: number }
): Promise<ILowStockResponse> => {
    const { data } = await api.get<ILowStockResponse>(
        "/admin/report/inventory/low-stock",
        { params }
    );
    return data;
};

// ==============================
// 3. Stock Value Report
// GET /admin/report/inventory/stock-value
// ==============================
export const getStockValueReport = async (
    params?: { page?: number, productId?: string, limit?: number }
): Promise<IStockValueResponse> => {
    const { data } = await api.get<IStockValueResponse>(
        "/admin/report/inventory/stock-value",
        { params }
    );
    return data;
};

// ==============================
// 4. Stock Movement Report
// GET /admin/report/inventory/stock-movement
// ==============================
export const getStockMovementReport = async (
    params?: { from?: string; to?: string; page?: number; limit?: number; productId?: string }
): Promise<IStockMovementResponse> => {
    const { data } = await api.get<IStockMovementResponse>(
        "/admin/report/inventory/stock-movement",
        { params }
    );
    return data;
};

// ==============================
// 5. Fast Moving Products
// GET /admin/report/inventory/fast-moving
// ==============================
export const getFastMovingProducts = async (
    params?: { from?: string; to?: string; limit?: number }
): Promise<IFastMovingResponse> => {
    const { data } = await api.get<IFastMovingResponse>(
        "/admin/report/inventory/fast-moving",
        { params }
    );
    return data;
};

// ==============================
// 6. Slow Moving Products
// GET /admin/report/inventory/slow-moving
// ==============================
export const getSlowMovingProducts = async (
    params?: { from?: string; to?: string; limit?: number }
): Promise<ISlowMovingResponse> => {
    const { data } = await api.get<ISlowMovingResponse>(
        "/admin/report/inventory/slow-moving",
        { params }
    );
    return data;
};

// ==============================
// 7. Batch Aging Report
// GET /admin/report/inventory/batch-aging
// ==============================
export const getBatchAgingReport = async (
    params?: { daysOlder?: number }
): Promise<IBatchAgingResponse> => {
    const { data } = await api.get<IBatchAgingResponse>(
        "/admin/report/inventory/batch-aging",
        { params }
    );
    return data;
};

// ==============================
// 8. Batch List Report
// GET /admin/report/inventory/batches
// ==============================
export const getBatchListReport = async (
    params?: {
        productId?: string;
        supplierId?: string;
        page?: number;
        limit?: number;
        search?: string;
    }
): Promise<IBatchListResponse> => {
    const { data } = await api.get<IBatchListResponse>(
        "/admin/report/inventory/batches",
        { params }
    );
    return data;
};
