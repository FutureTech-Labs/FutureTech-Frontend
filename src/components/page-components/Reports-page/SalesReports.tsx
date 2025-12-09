"use client";

import {
    useState,
    useEffect
} from "react";

import { DateRange } from "react-day-picker";

import {
    getInvoiceListReport,
    getPaymentBreakdown,
    getSalesByCashierReport,
    getSalesSummary,
    getSalesTrends,
    getTopProducts
} from "@/services/Report-Services/salesReportServices";

import {
    formatCurrencyLKR,
    formatDateTime,
    normalizeDateRange,
    toSentenceCase
} from "@/lib/utils";

import {
    BarChart2,
    DollarSign,
    Receipt,
    ShoppingCart
} from "lucide-react";

import KPI from "@/components/cards/KPICard";
import DataTable from "@/components/common/Table";
import SelectField from "@/components/forms/SelectField";
import PaginationSlider from "@/components/sliders/PaginationSlider";
import { DateRangePicker } from "@/components/common/DateRangePicker";
import SalesTrendsChart from "@/components/charts/sales-report-charts/SalesTrendsChart";
import TopProductsChart from "@/components/charts/sales-report-charts/TopProductsChart";
import PaymentBreakdownChart from "@/components/charts/sales-report-charts/PaymentBreakdownChart";

const SalesReports = () => {
    // 1. Sales Summary
    const [summary, setSummary] = useState<ISalesSummary | null>(null);

    // 2. Sales Trends
    const [trends, setTrends] = useState<ISalesTrendPoint[] | null>(null);

    // 3. Top Products
    const [topProducts, setTopProducts] = useState<ITopProductItem[] | null>(null);

    // 4. Sales By Cashier
    const [cashierReport, setCashierReport] = useState<ISalesByCashierReportResponse | null>(null);

    // 5. Payment Breakdown
    const [paymentBreakdown, setPaymentBreakdown] = useState<IPaymentBreakdownItem[] | null>(null);

    // 6. Invoice List
    const [invoiceList, setInvoiceList] = useState<ISalesInvoiceListResponse | null>(null);

    const [roleFilter, setRoleFilter] = useState<"cashier" | "admin">("cashier");

    // Table states
    const [page, setPage] = useState(1);
    const [loadingCashier, setLoadingCashier] = useState(false);

    // Table Meta
    const total = cashierReport?.meta.total ?? 0;
    const limit = cashierReport?.meta.limit ?? 10;
    const totalPages = cashierReport?.meta.totalPages ?? 1;

    // Date states
    const [to, setTo] = useState("");
    const [from, setFrom] = useState("");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadAllReports = async () => {
            try {
                const [
                    summaryRes,
                    trendsRes,
                    topProdRes,
                    paymentRes,
                    invoiceRes,
                ] = await Promise.all([
                    getSalesSummary(),
                    getSalesTrends(),
                    getTopProducts(),
                    getPaymentBreakdown(),
                    getInvoiceListReport(),
                ]);

                if (summaryRes.success) setSummary(summaryRes.data);
                if (trendsRes.success) setTrends(trendsRes.data);
                if (topProdRes.success) setTopProducts(topProdRes.data);
                if (paymentRes.success) setPaymentBreakdown(paymentRes.data);
                if (invoiceRes.success) setInvoiceList(invoiceRes);

            } catch (error) {
                console.error("Error fetching sales reports:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAllReports();
    }, []);


    const loadCashierReport = async () => {
        try {
            setLoadingCashier(true);

            const cashierRes = await getSalesByCashierReport({
                dateFrom: from,
                dateTo: to,
                page,
                limit: limit,
                role: roleFilter
            });

            if (cashierRes.success) {
                setCashierReport(cashierRes);
            }
        } catch (error) {
            console.error("Cashier report error:", error);
        } finally {
            setLoadingCashier(false);
        }
    };

    useEffect(() => {
        loadCashierReport();
    }, [page, from, to, roleFilter]);


    // Sync date range
    useEffect(() => {
        const { from, to } = normalizeDateRange(dateRange);
        setFrom(from);
        setTo(to);
    }, [dateRange]);


    if (loading) {
        return (
            <div>Loading...</div>
        );
    }

    if (!summary) {
        return <p className="text-red-400">Failed to load sales data.</p>;
    }

    const cards = [
        <KPI
            key="salesTotal"
            title="Total Sales"
            value={formatCurrencyLKR(summary.totalSales, false)}
            icon={<DollarSign className="w-6 h-6 text-emerald-400" />}
            iconBg="bg-emerald-500/10"
            gradient="linear-gradient(79.74deg, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0.1) 100%)"
        />,

        <KPI
            key="totalProfits"
            title="Total Profit"
            value={formatCurrencyLKR(summary.totalProfit, false)}
            icon={<BarChart2 className="w-6 h-6 text-cyan-400" />}
            iconBg="bg-cyan-500/10"
            gradient="linear-gradient(79.74deg, rgba(6, 182, 212, 0.15) 0%, rgba(0,0,0,0.1) 100%)"
        />,

        <KPI
            key="itemsSold"
            title="Items Sold"
            value={summary.itemsSold}
            icon={<ShoppingCart className="w-6 h-6 text-purple-400" />}
            iconBg="bg-purple-500/10"
            gradient="linear-gradient(79.74deg, rgba(168, 85, 247, 0.15) 0%, rgba(0,0,0,0.1) 100%)"
        />,

        <KPI
            key="invoiceCount"
            title="Invoice Count"
            value={summary.invoiceCount}
            icon={<Receipt className="w-6 h-6 text-indigo-400" />}
            iconBg="bg-indigo-500/10"
            gradient="linear-gradient(79.74deg, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0.1) 100%)"
        />,

        <KPI
            key="avgSalesValue"
            title="Average Sale Value"
            value={formatCurrencyLKR(summary.avgSale, false)}
            icon={<DollarSign className="w-6 h-6 text-yellow-400" />}
            iconBg="bg-yellow-500/10"
            gradient="linear-gradient(79.74deg, rgba(234, 179, 8, 0.15) 0%, rgba(0,0,0,0.1) 100%)"
        />,
    ];

    // Cashier Sales Table Columns
    const CashierSalesTableColumns = [
        {
            key: "cashierName",
            label: "Cashier Name",
            render: (row: ISalesByCashierReportItem) => (
                <span>
                    {row.cashierName}
                    {row.userRole === "admin" && (
                        <span className="ml-1 text-yellow-400 text-xs">(ADMIN)</span>
                    )}
                </span>
            ),
        },

        {
            key: "cashierEmail",
            label: "Email",
            render: (row: ISalesByCashierReportItem) => row.cashierEmail,
        },

        {
            key: "dateRange",
            label: "Date Range",
            render: (row: ISalesByCashierReportItem) => {
                const from = row.firstSaleDate;
                const to = row.lastSaleDate;

                const sameDay =
                    from &&
                    to &&
                    new Date(from).toDateString() === new Date(to).toDateString();

                return (
                    <div className="flex flex-col text-xs gap-1.5">
                        {sameDay ? (
                            <span>{formatDateTime(from, { hideTime: true })}</span>
                        ) : (
                            <>
                                <span>From: {formatDateTime(from, { hideTime: true })}</span>
                                <span>To: {formatDateTime(to, { hideTime: true })}</span>
                            </>
                        )}
                    </div>
                );
            },
        },

        {
            key: "totalSales",
            label: "Total Sales",
            render: (row: ISalesByCashierReportItem) =>
                formatCurrencyLKR(row.totalSales, false),
        },

        {
            key: "invoiceCount",
            label: "Invoices",
            render: (row: ISalesByCashierReportItem) => row.invoiceCount,
        },

        {
            key: "totalProfit",
            label: "Total Profit",
            render: (row: ISalesByCashierReportItem) =>
                formatCurrencyLKR(row.totalProfit, false),
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* KPI Cards */}
            <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {cards}
            </div>

            {/* Mobile Slider */}
            <PaginationSlider>{cards}</PaginationSlider>

            {/* Sales trends chart & top products chart*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SalesTrendsChart data={trends!} />
                <TopProductsChart data={topProducts!} />
                <PaymentBreakdownChart data={paymentBreakdown} />
            </div>

            {/* Cashier sales table */}
            <div className="flex flex-col gap-6 p-5 rounded-xl border-2 border-gradient border-primary-900/40 table-bg-gradient 
            shadow-lg shadow-primary-900/15">

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <h1 className="text-sm md:text-lg font-semibold w-full">Sales by {toSentenceCase(roleFilter)}</h1>

                    <div className="flex flex-col md:flex-row gap-4 w-full items-center justify-end">

                        <SelectField
                            placeholder="Select Role"
                            value={roleFilter}
                            onChange={(val) => {
                                setRoleFilter(val as "cashier" | "admin");
                                setPage(1);
                            }}
                            options={[
                                { label: "Cashiers", value: "cashier" },
                                { label: "Admin", value: "admin" },
                            ]}
                            width="md:max-w-[150px] search-gradient"
                        />

                        <DateRangePicker
                            value={dateRange}
                            onChange={setDateRange}
                            className="md:max-w-[250px]"
                        />
                    </div>
                </div>

                <DataTable
                    columns={CashierSalesTableColumns}
                    data={cashierReport?.data ?? []}
                    loading={loadingCashier}
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

export default SalesReports;