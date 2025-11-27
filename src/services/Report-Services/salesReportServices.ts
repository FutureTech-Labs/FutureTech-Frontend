import api from "@/lib/api";

// ==============================
// Sales Summary Report
// GET /admin/report/sales/summary
// ==============================
export const getSalesSummary = async (
    params?: { dateFrom?: string; dateTo?: string }
): Promise<ISalesSummaryResponse> => {
    const { data } = await api.get<ISalesSummaryResponse>(
        "/admin/report/sales/summary",
        { params }
    );
    return data;
};

// ==============================
// Sales Trends (Daily / Monthly)
// GET /admin/report/sales/trends
// ==============================
export const getSalesTrends = async (
    params?: {
        dateFrom?: string;
        dateTo?: string;
        interval?: "day" | "month";
    }
): Promise<ISalesTrendsResponse> => {
    const { data } = await api.get<ISalesTrendsResponse>(
        "/admin/report/sales/trends",
        { params }
    );
    return data;
};

// ==============================
// Top Products
// GET /admin/report/sales/top-products
// ==============================
export const getTopProducts = async (
    params?: {
        dateFrom?: string;
        dateTo?: string;
        limit?: number;
    }
): Promise<ITopProductsResponse> => {
    const { data } = await api.get<ITopProductsResponse>(
        "/admin/report/sales/top-products",
        { params }
    );
    return data;
};

// ==============================
// Sales By Cashier (Detailed Version)
// GET /admin/report/sales/by-cashier/detail
// ==============================
export const getSalesByCashierReport = async (
    params?: { dateFrom?: string; dateTo?: string; page?: number; limit?: number }
): Promise<ISalesByCashierReportResponse> => {
    const { data } = await api.get<ISalesByCashierReportResponse>(
        "/admin/report/sales/by-cashier/detail",
        { params }
    );
    return data;
};


// ==============================
// Payment Breakdown
// GET /admin/report/sales/payment-breakdown
// ==============================
export const getPaymentBreakdown = async (
    params?: { dateFrom?: string; dateTo?: string }
): Promise<IPaymentBreakdownResponse> => {
    const { data } = await api.get<IPaymentBreakdownResponse>(
        "/admin/report/sales/payment-breakdown",
        { params }
    );
    return data;
};

// ==============================
// Invoice List Report (Paginated Table)
// GET /admin/report/sales/invoices
// ==============================
export const getInvoiceListReport = async (
    params?: {
        page?: number;
        limit?: number;
        dateFrom?: string;
        dateTo?: string;
    }
): Promise<ISalesInvoiceListResponse> => {
    const { data } = await api.get<ISalesInvoiceListResponse>(
        "/admin/report/sales/invoices",
        { params }
    );
    return data;
};
