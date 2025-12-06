"use client";

import {
    useState,
    useEffect
} from "react";

import {
    getExpenseSummary,
    getExpensesByCategory,
    getExpenseTrends,
    listExpensesReport
} from "@/services/Report-Services/expenseReportServices";

import { DateRange } from "react-day-picker";

import KPI from "@/components/cards/KPICard";
import { formatCurrencyLKR, formatLocalDate } from "@/lib/utils";
import PaginationSlider from "@/components/sliders/PaginationSlider";
import { DollarSign, Receipt, BarChart2, TrendingUp } from "lucide-react";
import ExpenseTrendsChart from "@/components/charts/expense-report-charts/ExpenseTrendsReportsChart";
import CategoryExpenseReportChart from "@/components/charts/expense-report-charts/CategoryExpenseReportChart";
import DataTable from "@/components/common/Table";
import { DateRangePicker } from "@/components/common/DateRangePicker";
import SelectField from "@/components/forms/SelectField";
import { EXPENSE_CATEGORIES } from "@/constants";
import ExportPDFButton from "@/components/common/ExportPdfButton";

const ExpenseReports = () => {

    // Summary
    const [summary, setSummary] = useState<IExpenseSummaryData | null>(null);

    // Category Breakdown
    const [categoryBreakdown, setCategoryBreakdown] = useState<IExpenseCategoryBreakdownItem[] | null>(null);

    // Trends
    const [trends, setTrends] = useState<IExpenseTrendItem[] | IExpenseTrendItemWithBreakdown[] | null>(null);

    const [interval, setInterval] = useState<"day" | "month">("month");

    // Expense List (paginated table)
    const [expenseList, setExpenseList] = useState<IExpenseReportListResponse | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Table pagination
    const [page, setPage] = useState(1);
    const limit = expenseList?.meta.limit ?? 10;

    const total = expenseList?.meta.total ?? 0;
    const totalPages = Math.ceil(total / limit);

    const [loadingList, setLoadingList] = useState(false);

    // Date range filters
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    // Global loading (for the entire page)
    const [loading, setLoading] = useState(true);

    // --------------------------------------------------------
    // Load all data
    // --------------------------------------------------------
    useEffect(() => {
        const loadAllReports = async () => {
            try {
                const [
                    summaryRes,
                    categoryRes,
                    trendsRes,
                    listRes
                ] = await Promise.all([
                    getExpenseSummary(),
                    getExpensesByCategory(),
                    getExpenseTrends(),
                    listExpensesReport(),
                ]);

                if (summaryRes.success) setSummary(summaryRes.data);
                if (categoryRes.success) setCategoryBreakdown(categoryRes.data);
                if (trendsRes.success) setTrends(trendsRes.data);
                if (listRes.success) setExpenseList(listRes);

            } catch (err) {
                console.error("Error fetching expense reports:", err);
            } finally {
                setLoading(false);
            }
        };

        loadAllReports();
    }, []);

    // --------------------------------------------------------
    // Load table data (pagination + filters)
    // --------------------------------------------------------
    const loadExpenseList = async () => {
        try {
            setLoadingList(true);

            const params: any = {
                page,
                from,
                to,
            };

            if (selectedCategory !== "all") {
                params.category = selectedCategory;
            }

            const res = await listExpensesReport(params);

            if (res.success) setExpenseList(res);

        } catch (err) {
            console.error("Expense list load error:", err);
        } finally {
            setLoadingList(false);
        }
    };

    useEffect(() => {
        loadExpenseList();
    }, [page, from, to, selectedCategory]);


    // --------------------------------------------------------
    // Sync formatted dates from date selector
    // --------------------------------------------------------
    useEffect(() => {
        setFrom(formatLocalDate(dateRange?.from));
        setTo(formatLocalDate(dateRange?.to));
    }, [dateRange]);

    if (loading) {
        return <div>Loading...</div>;
    }

    // KPI cards
    const summaryCards = summary ?
        [
            <KPI
                key="totalExpense"
                title="Total Expense"
                value={formatCurrencyLKR(summary.totalExpense, false)}
                icon={<DollarSign className="w-6 h-6 text-red-400" />}
                iconBg="bg-red-500/10"
                gradient="linear-gradient(79.74deg, rgba(239, 68, 68, 0.15) 0%, rgba(0,0,0,0.1) 100%)"
            />,

            <KPI
                key="expenseCount"
                title="Total Expense Entries"
                value={summary.totalCount}
                icon={<Receipt className="w-6 h-6 text-orange-400" />}
                iconBg="bg-orange-500/10"
                gradient="linear-gradient(79.74deg, rgba(249, 115, 22, 0.15) 0%, rgba(0,0,0,0.1) 100%)"
            />,

            <KPI
                key="avgPerDay"
                title="Avg Expense Per Day"
                value={formatCurrencyLKR(summary.avgPerDay, false)}
                icon={<BarChart2 className="w-6 h-6 text-amber-400" />}
                iconBg="bg-amber-500/10"
                gradient="linear-gradient(79.74deg, rgba(245, 158, 11, 0.15) 0%, rgba(0,0,0,0.1) 100%)"
            />,

            <KPI
                key="highestExpense"
                title="Highest Expense"
                value={
                    summary.highestExpense
                        ? formatCurrencyLKR(summary.highestExpense.amount, false)
                        : "—"
                }
                icon={<TrendingUp className="w-6 h-6 text-rose-400" />}
                iconBg="bg-rose-500/10"
                gradient="linear-gradient(79.74deg, rgba(244, 63, 94, 0.15) 0%, rgba(0,0,0,0.1) 100%)"
            />,
        ] : [];

    // Table columns
    const ExpenseTableColumns = [
        {
            key: "category",
            label: "Category",
            render: (row: IExpenseReportItem) => row.category,
            enableSorting: true,
        },
        {
            key: "type",
            label: "Type",
            render: (row: IExpenseReportItem) => row.type,
            enableSorting: true,
        },
        {
            key: "amount",
            label: "Amount",
            render: (row: IExpenseReportItem) => formatCurrencyLKR(row.amount, false),
            enableSorting: true,
        },
        {
            key: "date",
            label: "Date",
            render: (row: IExpenseReportItem) => formatLocalDate(new Date(row.date)),
            enableSorting: true,
        },
        {
            key: "description",
            label: "Description",
            render: (row: IExpenseReportItem) =>
                row.description ? (
                    <div className="max-w-80 whitespace-normal line-clamp-3">
                        {row.description}
                    </div>
                ) : "—",
        },
        {
            key: "linkedPurchase",
            label: "Linked Purchase",
            render: (row: IExpenseReportItem) =>
                row.linkedPurchase?.invoiceNumber ? (
                    <div className="flex flex-col">
                        <span className="font-medium">{row.linkedPurchase.invoiceNumber}</span>
                        <span className="text-xs text-muted-foreground">
                            {row.linkedPurchase.supplier?.name}
                        </span>
                    </div>
                ) : (
                    "—"
                ),
        },
    ];

    // Export columns
    const expenseReportExportColumns = [
        {
            header: "Category",
            key: "category",
        },
        {
            header: "Type",
            key: "type",
        },
        {
            header: "Amount",
            key: "amount",
            format: (v: number) => formatCurrencyLKR(v),
        },
        {
            header: "Date",
            key: "date",
            format: (v: string) => formatLocalDate(new Date(v)),
        },
        {
            header: "Description",
            key: "description",
        },
        {
            header: "Linked Purchase",
            key: "linkedPurchase",
            format: (value: any, row: IExpenseReportItem) =>
                row.linkedPurchase?.invoiceNumber
                    ? `${row.linkedPurchase.invoiceNumber}\n${row.linkedPurchase.supplier?.name ?? ""}`
                    : "—",
        },
    ];


    return (
        <div className="flex flex-col gap-6">
            {/* Desktop KPI Cards */}
            <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryCards}
            </div>

            {/* Mobile Slider */}
            <PaginationSlider>
                {summaryCards}
            </PaginationSlider>

            {/* Category Breakdown Chart + Expense Trends Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Category Breakdown */}
                <CategoryExpenseReportChart data={categoryBreakdown ?? []} />

                {/* Expense Trends */}
                <ExpenseTrendsChart
                    trends={trends}
                    interval={interval}
                    onIntervalChange={setInterval}
                />
            </div>

            {/* Expense List Section */}
            <div
                className="flex flex-col gap-6 p-5 rounded-xl border-2 border-gradient border-primary-900/40 table-bg-gradient
                shadow-lg shadow-primary-900/15"
            >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-sm md:text-lg font-semibold">Expense List</h1>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">

                        {/* Date Range Filter */}
                        <DateRangePicker
                            value={dateRange}
                            onChange={setDateRange}
                            className="w-full sm:w-xs"
                        />

                        <SelectField
                            placeholder="Category"
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            options={EXPENSE_CATEGORIES}
                            width="sm:w-[180px]"
                            className="search-gradient"
                        />

                        <ExportPDFButton
                            fileName="expense_report.pdf"
                            title="Expense Report"
                            columns={expenseReportExportColumns}
                            data={expenseList?.data ?? []}
                            buttonLabel="Export PDF"
                        />
                    </div>
                </div>

                {/* Table */}
                <DataTable
                    columns={ExpenseTableColumns}
                    data={expenseList?.data ?? []}
                    loading={loadingList}
                    pagination={{
                        page,
                        totalPages,
                        total,
                        onPageChange: (newPage) => setPage(newPage),
                    }}
                />
            </div>
        </div>
    );
};

export default ExpenseReports;
