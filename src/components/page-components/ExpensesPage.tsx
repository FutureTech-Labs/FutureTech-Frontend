"use client";

import {
    useEffect,
    useState
} from "react";

import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import SelectField from "../forms/SelectField";
import ExpenseForm from "../forms/ExpenseForm";
import { BanknoteArrowDown } from "lucide-react";

import { Button } from "../ui/button";
import DataTable from "../common/Table";
import DialogBox from "../common/DialogBox";
import IconButton from "../common/IconButton";
import { TooltipWrapper } from "../common/TooltipWrapper";
import { DateRangePicker } from "../common/DateRangePicker";

import { deleteExpense, getExpenses } from "@/services/expenseServices";

import { EXPENSE_CATEGORIES } from "@/constants";
import { formatDateTime, normalizeDateRange } from "@/lib/utils";

import CategoryExpenseChart from "../charts/expenses-charts/CategoryExpenseChart";
import ProfitVsExpenseChart from "../charts/expenses-charts/ProfitVsExpenseChart";

const ExpensesPage = () => {
    const [expenses, setExpenses] = useState<IExpense[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("all");

    const [selectedExpense, setSelectedExpense] = useState<IExpense | null>(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [refreshCharts, setRefreshCharts] = useState(0);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Sync date range
    useEffect(() => {
        const { from, to } = normalizeDateRange(dateRange);
        setFrom(from);
        setTo(to);
        setPage(1);
    }, [dateRange]);

    // Fetch expenses
    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const params: any = { page, limit: 10 };

            if (from) params.from = from;
            if (to) params.to = to;
            if (selectedCategory !== "all") params.category = selectedCategory;

            const res = await getExpenses(params);

            if (res.success) {
                setExpenses(res.data);
                setTotal(res.meta.total);
                setTotalPages(Math.ceil(res.meta.total / res.meta.limit));
            }
        } catch (err) {
            console.error("Failed to load expenses:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [page, from, to, selectedCategory]);

    const handleDeleteExpense = async (expenseId: string) => {
        try {
            const res = await deleteExpense(expenseId);
            toast.success(res.message || "Expense deleted");
            fetchExpenses(); // refresh table
            setRefreshCharts((n) => n + 1);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to delete expense");
        }
    };


    // Table Columns
    const ExpenseColumns = [
        {
            key: "date",
            label: "Date",
            render: (e: IExpense) => (
                <div className="whitespace-nowrap">
                    {formatDateTime(e.createdAt)}
                </div>
            ),
        },

        {
            key: "category",
            label: "Category",
            render: (e: IExpense) => e.category,
        },
        {
            key: "amount",
            label: "Amount (Rs.)",
            render: (e: IExpense) => (
                <span className="font-medium text-green-400">
                    Rs. {e.amount.toFixed(2)}
                </span>
            ),
        },
        {
            key: "type",
            label: "Type",
            render: (e: IExpense) => (
                <span className="capitalize text-sm">{e.type}</span>
            ),
        },
        {
            key: "description",
            label: "Description",
            render: (e: IExpense) => (
                <div className="max-w-80 truncate">
                    {e.description || "—"}
                </div>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (e: IExpense) => (
                <div className="flex gap-2">

                    {/* EDIT */}
                    <TooltipWrapper content="Edit Expense">
                        <IconButton
                            iconSrc="/icons/Edit.svg"
                            ariaLabel="Edit"
                            onClick={() => {
                                setSelectedExpense(e);
                                setAddDialogOpen(true);
                            }}
                        />
                    </TooltipWrapper>

                    <TooltipWrapper content="Delete Expense">
                        <IconButton
                            iconSrc="/icons/Minus.svg"
                            ariaLabel="Delete"
                            onClick={() => handleDeleteExpense(e._id)}
                        />
                    </TooltipWrapper>
                </div>
            ),
        },
    ];

    return (
        <div className="relative flex flex-col gap-6">

            <div className="flex h-full w-full items-center justify-center">
                <div className="grid h-full w-full gap-6 grid-cols-1 md:grid-cols-5 grid-rows-2 rounded-lg shadow-md pb-0">

                    {/* First Chart */}
                    <div className="col-span-3 row-span-2">
                        <ProfitVsExpenseChart refresh={refreshCharts} expenses={expenses} />
                    </div>

                    {/* Second Chart */}
                    <div className="col-span-3 md:col-span-2 row-span-2">
                        <CategoryExpenseChart refresh={refreshCharts} expenses={expenses} />
                    </div>
                </div>
            </div>

            {/* Table Wrapper */}
            <div className="flex flex-col gap-6 p-5 rounded-xl border-2 border-gradient border-primary-900/40 table-bg-gradient shadow-lg 
            shadow-primary-900/15">

                <h2 className="text-lg font-semibold text-gray-200">Expense Overview</h2>

                <div className="flex md:flex-row flex-col gap-5 items-center justify-between w-full">

                    <DateRangePicker
                        value={dateRange}
                        onChange={setDateRange}
                        className="md:max-w-md"
                        align="start"
                    />

                    <div className="flex md:flex-row flex-col gap-5 w-full justify-end">

                        <SelectField
                            placeholder="Filter by category"
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            options={EXPENSE_CATEGORIES}
                            width="md:w-[180px]"
                            className="bg-black-500! border border-white/50 focus:ring-1! focus:ring-primary-800! text-xs md:text-sm"
                        />

                        <Button
                            onClick={() => {
                                setSelectedExpense(null);
                                setAddDialogOpen(true);
                            }}
                            className="main-button-gradient border-none!"
                        >
                            Add Expense
                            <BanknoteArrowDown className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>

                {/* Expenses Table */}
                <DataTable
                    columns={ExpenseColumns}
                    data={expenses}
                    loading={loading}
                    pagination={{
                        page,
                        totalPages,
                        total,
                        onPageChange: (newPage) => setPage(newPage),
                    }}
                />
            </div>

            {/* Add/Edit Expense Form */}
            <DialogBox
                open={addDialogOpen}
                onOpenChange={(open) => {
                    setAddDialogOpen(open);
                    if (!open) setSelectedExpense(null);
                }}
                title={selectedExpense ? "Edit Expense" : "Add Expense"}
            >
                <ExpenseForm
                    expense={selectedExpense}
                    onSuccess={() => {
                        setAddDialogOpen(false);
                        setSelectedExpense(null);
                        fetchExpenses();
                        setRefreshCharts(r => r + 1);
                    }}
                    onCancel={() => {
                        setAddDialogOpen(false);
                        setSelectedExpense(null);
                    }}
                />
            </DialogBox>

        </div>
    );
};

export default ExpensesPage;
