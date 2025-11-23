// src/services/expenseService.ts
import api from "@/lib/api";

// ==============================
// Create Expense (POST /admin/expenses)
// ==============================
export const createExpense = async (
    payload: ICreateExpenseRequest
): Promise<ICreateExpenseResponse> => {
    const { data } = await api.post<ICreateExpenseResponse>(
        "/admin/expense",
        payload
    );
    return data;
};

// ==============================
// Get Expenses (GET /admin/expenses)
// Filters: page, limit, from, to, category
// ==============================
export const getExpenses = async (
    params?: {
        page?: number;
        limit?: number;
        from?: string;
        to?: string;
        category?: ExpenseCategory;
    }
): Promise<IExpenseListResponse> => {
    const { data } = await api.get<IExpenseListResponse>(
        "/admin/expenses",
        { params }
    );
    return data;
};

// ==============================
// Update Expense (PUT /admin/expenses/:id)
// ==============================
export const updateExpense = async (
    id: string,
    payload: Partial<ICreateExpenseRequest>
): Promise<{ success: boolean; expense: IExpense }> => {
    const { data } = await api.put(`/admin/expense/${id}`, payload);
    return data;
};

// ==============================
// Delete Expense (DELETE /admin/expenses/:id)
// ==============================
export const deleteExpense = async (
    id: string
): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.delete(`/admin/expense/${id}`);
    return data;
};

// ==============================
// Analytics — Monthly Expenses (GET /admin/analytics/expenses/monthly)
// ==============================
export const getMonthlyExpenses = async (
    months = 12
): Promise<IMonthlyExpenseResponse> => {
    const { data } = await api.get<IMonthlyExpenseResponse>(
        "/admin/analytics/expenses/monthly",
        { params: { months } }
    );
    return data;
};

// ==============================
// Analytics — Profit vs Expense (GET /admin/analytics/profit-vs-expense)
// ==============================
export const getProfitVsExpense = async (
    months = 12
): Promise<IProfitVsExpenseResponse> => {
    const { data } = await api.get<IProfitVsExpenseResponse>(
        "/admin/analytics/profit-vs-expense",
        { params: { months } }
    );
    return data;
};

// ==============================
// Analytics — Daily Profit (GET /admin/analytics/profit/daily)
// ==============================
export const getDailyProfit = async (
    days = 30
): Promise<IDailyProfitResponse> => {
    const { data } = await api.get<IDailyProfitResponse>(
        "/admin/analytics/profit/daily",
        { params: { days } }
    );
    return data;
};
