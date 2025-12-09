import api from "@/lib/api";

export const getAllStockBatches = async (params?: {
    search?: string;
    page?: number;
    limit?: number;
}): Promise<IStockResponse> => {
    const res = await api.get<IStockResponse>("/admin/stock", { params });
    return res.data;
};

export const getProductStock = async (
    productId: string
): Promise<IProductStockResponse> => {
    const res = await api.get<IProductStockResponse>(`/admin/stock/${productId}`);
    return res.data;
};

export const deleteBatch = async (
    batchId: string
): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete<{ success: boolean; message: string }>(`/admin/stock/${batchId}`);
    return res.data;
};

export const getStockStats = async (): Promise<IStockStatsResponse> => {
    const res = await api.get<IStockStatsResponse>("/admin/stocks/stats");
    return res.data;
};
