import api from "@/lib/api";

// ==============================
// Area Chart (Revenue + Profit + Expense)
// GET /admin/dashboard/area-chart
// ==============================
export const getAreaChart = async (
    params?: { months?: number }
): Promise<IAreaChartResponse> => {
    const { data } = await api.get<IAreaChartResponse>(
        "/admin/dashboard/area-chart",
        { params }
    );
    return data;
};

// ==============================
// Top Selling Products (Qty, Revenue, Profit)
// GET /admin/dashboard/top-products
// ==============================
export const getTopSellingProducts = async (
    params?: { months?: number; limit?: number }
): Promise<ITopSellingProductsResponse> => {
    const { data } = await api.get<ITopSellingProductsResponse>(
        "/admin/dashboard/top-products",
        { params }
    );
    return data;
};

// ==============================
// Daily Profit vs Expense (Radial Chart)
// GET /admin/dashboard/daily-profit-expense
// ==============================
export const getDailyProfitExpense = async (
    params?: { days?: number }
): Promise<IDailyProfitExpenseResponse> => {
    const { data } = await api.get<IDailyProfitExpenseResponse>(
        "/admin/dashboard/daily-profit-expense",
        { params }
    );
    return data;
};

// ==============================
// Recent 3 Expenses
// GET /admin/dashboard/recent-expenses
// ==============================
export const getRecentExpenses = async (): Promise<IRecentExpensesResponse> => {
    const { data } = await api.get<IRecentExpensesResponse>(
        "/admin/dashboard/recent-expenses"
    );
    return data;
};

// ==============================
// Inventory Overview
// GET /admin/dashboard/inventory-overview
// ==============================
export const getInventoryOverview = async (): Promise<IInventoryOverviewResponse> => {
    const { data } = await api.get<IInventoryOverviewResponse>(
        "/admin/dashboard/inventory-overview"
    );
    return data;
};
