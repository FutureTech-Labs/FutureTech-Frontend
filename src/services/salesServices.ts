import api from "@/lib/api";

// ==============================
// Create Sale (POST /sales)
// ==============================
export const createSale = async (
    payload: ICreateSaleRequest
): Promise<ICreateSaleResponse> => {
    const { data } = await api.post<ICreateSaleResponse>("/shared/sales", payload);
    return data;
};

// ==============================
// Get logged-in user's sales (GET /sales/me)
// Admin → returns admin's own sales
// Cashier → returns only cashier's sales
// ==============================
export const getMySales = async (
    params?: { page?: number; limit?: number }
): Promise<ISalesListResponse> => {
    const { data } = await api.get<ISalesListResponse>("/shared/sales/me", {
        params,
    });
    return data;
};

// ==============================
// Admin: Get all sales (GET /admin/sales)
// ==============================
export const getAllSales = async (
    params?: {
        page?: number;
        limit?: number;
        from?: string;
        to?: string;
        invoiceNumber: string;
    }
): Promise<ISalesListResponse> => {
    const { data } = await api.get<ISalesListResponse>("/admin/sales", {
        params,
    });
    return data;
};

// ==============================
// Get invoice by ID (GET /sales/:id)
// Cashier → can view only own invoices
// Admin → can view any invoice
// ==============================
export const getSaleById = async (
    saleId: string
): Promise<IGetSaleByIdResponse> => {
    const { data } = await api.get<IGetSaleByIdResponse>(`/shared/sales/${saleId}`);
    return data;
};

// ==============================
// Admin Only — Sales by Cashier Report
// (GET /admin/report/sales/by-cashier)
// ==============================
export const getSalesByCashier = async (
    params?: { from?: string; to?: string }
): Promise<ISalesByCashierResponse> => {
    const { data } = await api.get<ISalesByCashierResponse>(
        "/admin/report/sales/by-cashier",
        { params }
    );
    return data;
};