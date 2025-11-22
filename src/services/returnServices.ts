import api from "@/lib/api";

// ======================================================
// Create Return (POST /admin/return)
// ======================================================
export const createReturn = async (
    payload: ICreateReturnRequest
): Promise<ICreateReturnResponse> => {
    const { data } = await api.post<ICreateReturnResponse>(
        "/admin/return",
        payload
    );
    return data;
};

// ======================================================
// Get All Returns (GET /admin/returns)
// Supports: invoiceNumber, status, page, limit, dateFrom, dateTo
// ======================================================
export const getReturns = async (
    params?: {
        invoiceNumber?: string;
        status?: "processed" | "sent-to-supplier" | "completed";
        page?: number;
        limit?: number;
        dateFrom?: string;
        dateTo?: string;
    }
): Promise<IReturnListResponse> => {
    const { data } = await api.get<IReturnListResponse>("/admin/returns", {
        params,
    });
    return data;
};

// ======================================================
// Get Single Return (GET /admin/return/:id)
// ======================================================
export const getReturnById = async (
    returnId: string
): Promise<IReturnSingleResponse> => {
    const { data } = await api.get<IReturnSingleResponse>(
        `/admin/return/${returnId}`
    );
    return data;
};
