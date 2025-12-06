import api from "@/lib/api";

// ==============================
// Expense Summary
// GET /admin/report/expenses/summary
// ==============================
export const getExpenseSummary = async (
    params?: { from?: string; to?: string; category?: string }
): Promise<IExpenseSummaryResponse> => {
    const { data } = await api.get<IExpenseSummaryResponse>(
        "/admin/report/expenses/summary",
        { params }
    );
    return data;
};

// ==============================
// Expenses By Category
// GET /admin/report/expenses/by-category
// ==============================
export const getExpensesByCategory = async (
    params?: { from?: string; to?: string }
): Promise<IExpensesByCategoryResponse> => {
    const { data } = await api.get<IExpensesByCategoryResponse>(
        "/admin/report/expenses/by-category",
        { params }
    );
    return data;
};

// ==============================
// Expense Trends (Daily / Monthly)
// GET /admin/report/expenses/trends
// ==============================
export const getExpenseTrends = async (
    params?: {
        from?: string;
        to?: string;
        interval?: "day" | "month";
        breakdown?: "true" | "false";
    }
): Promise<IExpenseTrendsResponse> => {
    const { data } = await api.get<IExpenseTrendsResponse>(
        "/admin/report/expenses/trends",
        { params }
    );
    return data;
};

// ==============================
// Paginated Expense List
// GET /admin/report/expenses
// ==============================
export const listExpensesReport = async (
    params?: {
        page?: number;
        limit?: number;
        from?: string;
        to?: string;
        category?: string;
        type?: string;
        minAmount?: number;
        maxAmount?: number;
        expandLinked?: "true" | "false";
    }
): Promise<IExpenseReportListResponse> => {
    const { data } = await api.get<IExpenseReportListResponse>(
        "/admin/report/expenses",
        { params }
    );
    return data;
};
