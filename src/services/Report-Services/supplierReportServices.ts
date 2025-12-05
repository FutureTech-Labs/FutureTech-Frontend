import api from "@/lib/api";

// ==============================
// Supplier Summary Report
// GET /admin/report/suppliers/summary
// ==============================
export const getSupplierSummary = async (
    params?: {
        page?: number;
        limit?: number;
        from?: string;
        to?: string;
        search?: string;
    }
): Promise<ISupplierSummaryResponse> => {
    const { data } = await api.get<ISupplierSummaryResponse>(
        "/admin/report/suppliers/summary",
        { params }
    );
    return data;
};

// ==============================
// Outstanding Suppliers Report
// GET /admin/report/suppliers/outstanding
// ==============================
export const getOutstandingSuppliers = async (
    params?: {
        page?: number;
        limit?: number;
        minBalance?: number;
        maxBalance?: number;
        sortBy?: string;   // "outstanding"
    }
): Promise<IOutstandingSuppliersResponse> => {
    const { data } = await api.get<IOutstandingSuppliersResponse>(
        "/admin/report/suppliers/outstanding",
        { params }
    );
    return data;
};

// ==============================
// Supplier Purchase Trends
// (Daily / Monthly)
// GET /admin/report/suppliers/trends
// ==============================
export const getSupplierPurchaseTrends = async (
    params?: {
        from?: string;
        to?: string;
        interval?: "day" | "month";
        supplierId?: string;
        page?: number;
        limit?: number;
    }
): Promise<ISupplierPurchaseTrendsResponse> => {
    const { data } = await api.get<ISupplierPurchaseTrendsResponse>(
        "/admin/report/suppliers/trends",
        { params }
    );
    return data;
};

// ==============================
// Supplier Item-Level Purchases
// GET /admin/report/suppliers/items
// ==============================
export const getSupplierItemsReport = async (
    params?: {
        supplierId?: string;
        supplierSearch?: string;
        from?: string;
        to?: string;
        page?: number;
        limit?: number;
    }
): Promise<ISupplierItemsReportResponse> => {
    const { data } = await api.get<ISupplierItemsReportResponse>(
        "/admin/report/suppliers/items",
        { params }
    );
    return data;
};
