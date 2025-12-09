import api from "@/lib/api";

// ==============================
// Cashier Sales Chart
// ==============================
export const getCashierSalesChart = async (
    params?: { days?: number; from?: string; to?: string }
): Promise<ICashierSalesChartResponse> => {
    const { data } = await api.get<ICashierSalesChartResponse>(
        "/cashier/dashboard/sales-chart",
        { params }
    );
    return data;
};

// ==============================
// Cashier Summary Cards
// ==============================
export const getCashierSalesSummary = async (
): Promise<ICashierSalesSummaryResponse> => {
    const { data } = await api.get<ICashierSalesSummaryResponse>(
        "/cashier/dashboard/summary"
    );
    return data;
};

// ==============================
// Cashier Recent Invoices (Last 10)
// ==============================
export const getCashierRecentInvoices = async (
): Promise<ICashierRecentInvoicesResponse> => {
    const { data } = await api.get<ICashierRecentInvoicesResponse>(
        "/cashier/dashboard/recent-invoices"
    );
    return data;
};
