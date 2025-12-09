"use client";

import { useState, useEffect } from "react";

import {
    getSupplierSummary,
    getOutstandingSuppliers,
    getSupplierPurchaseTrends,
    getSupplierItemsReport,
} from "@/services/Report-Services/supplierReportServices";

import { DateRange } from "react-day-picker";

import {
    formatDateTime,
    normalizeDateRange,
    formatCurrencyLKR
} from "@/lib/utils";

import {
    Users,
    FileCheck2,
    FileClock,
    Wallet,
    TrendingUp
} from "lucide-react";

import KPI from "@/components/cards/KPICard";
import DataTable from "@/components/common/Table";
import SearchField from "@/components/forms/SearchField";
import ReportSection from "@/components/common/ReportsSection";
import ExportPDFButton from "@/components/common/ExportPdfButton";
import PaginationSlider from "@/components/sliders/PaginationSlider";
import { DateRangePicker } from "@/components/common/DateRangePicker";
import SupplierTrendsChart from "@/components/charts/supplier-report-charts/SupplierTrendsChart";


const SupplierReports = () => {

    // 1. Supplier Summary
    const [summaryResponse, setSummaryResponse] = useState<ISupplierSummaryResponse | null>(null);
    const summary = summaryResponse?.data ?? [];

    const [pageSummary, setPageSummary] = useState(1);
    const limitSummary = 10;
    const totalSummary = summaryResponse?.meta.total ?? 0;
    const totalPagesSummary = Math.ceil(totalSummary / limitSummary);
    const [loadingSummary, setLoadingSummary] = useState(true);

    const [searchSummary, setSearchSummary] = useState("");
    const [summaryDateRange, setSummaryDateRange] = useState<DateRange | undefined>();
    const [summaryFrom, setSummaryFrom] = useState("");
    const [summaryTo, setSummaryTo] = useState("");


    // 2. Outstanding Suppliers
    const [outstanding, setOutstanding] = useState<IOutstandingSuppliersResponse | null>(null);
    const [pageOutstanding, setPageOutstanding] = useState(1);
    const [loadingOutstanding, setLoadingOutstanding] = useState(false);

    const totalOutstanding = outstanding?.meta.total ?? 0;
    const limitOutstanding = outstanding?.meta.limit ?? 10;
    const totalPagesOutstanding = Math.ceil(totalOutstanding / limitOutstanding);

    // 3. Purchase Trends (Chart)
    const [trends, setTrends] = useState<ISupplierTrendItem[] | null>(null);

    const [interval, setInterval] = useState<"day" | "month">("month");
    const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

    // Trend-specific date range
    const [trendDateRange, setTrendDateRange] = useState<DateRange | undefined>();
    const [trendFrom, setTrendFrom] = useState("");
    const [trendTo, setTrendTo] = useState("");


    // 4. Supplier Item-Level Report
    const [itemReport, setItemReport] = useState<ISupplierItemsReportResponse | null>(null);
    const [pageItems, setPageItems] = useState(1);
    const [itemSearch, setItemSearch] = useState("");
    const [loadingItems, setLoadingItems] = useState(false);

    const totalItems = itemReport?.meta.total ?? 0;
    const limitItems = itemReport?.meta.limit ?? 10;
    const totalPagesItems = Math.ceil(totalItems / limitItems);

    // Item purchase date range
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    // GLOBAL LOADING
    const [loading, setLoading] = useState<boolean>(true);

    // Sync Date Ranges

    // Item table date range
    useEffect(() => {
        const { from, to } = normalizeDateRange(dateRange);
        setFrom(from);
        setTo(to);
        setPageItems(1);
    }, [dateRange]);


    // Summary table date range
    useEffect(() => {
        const { from, to } = normalizeDateRange(summaryDateRange);
        setSummaryFrom(from);
        setSummaryTo(to);
        setPageSummary(1);
    }, [summaryDateRange]);


    // Trend chart date range
    useEffect(() => {
        const { from, to } = normalizeDateRange(trendDateRange);
        setTrendFrom(from);
        setTrendTo(to);
    }, [trendDateRange]);


    // INITIAL LOAD
    useEffect(() => {
        const loadAllReports = async () => {
            try {
                const [
                    summaryRes,
                    outstandingRes,
                    trendsRes,
                    itemsRes
                ] = await Promise.all([
                    getSupplierSummary({
                        page: 1,
                        limit: limitSummary,
                    }),

                    getOutstandingSuppliers({
                        page: 1,
                        limit: limitOutstanding,
                        sortBy: "outstanding",
                    }),

                    getSupplierPurchaseTrends({
                        interval: "month",
                    }),

                    getSupplierItemsReport({
                        page: 1,
                        limit: limitItems,
                    }),
                ]);

                if (summaryRes.success) setSummaryResponse(summaryRes);
                if (outstandingRes.success) setOutstanding(outstandingRes);
                if (trendsRes.success) setTrends(trendsRes.data);
                if (itemsRes.success) setItemReport(itemsRes);

            } catch (err) {
                console.error("Supplier reports load error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadAllReports();
    }, []);


    // Load Summary (with search + date)
    const loadSupplierSummary = async () => {
        try {
            setLoadingSummary(true);

            const res = await getSupplierSummary({
                page: pageSummary,
                limit: limitSummary,
                search: searchSummary || undefined,
                from: summaryFrom || undefined,
                to: summaryTo || undefined,
            });

            if (res.success) setSummaryResponse(res);
        } finally {
            setLoadingSummary(false);
        }
    };

    useEffect(() => {
        setPageSummary(1);
        loadSupplierSummary();
    }, [searchSummary, summaryFrom, summaryTo]);


    // Load Outstanding
    const loadOutstanding = async () => {
        try {
            setLoadingOutstanding(true);

            const res = await getOutstandingSuppliers({
                page: pageOutstanding,
                limit: limitOutstanding,
                sortBy: "outstanding",
            });

            if (res.success) setOutstanding(res);
        } catch (err) {
            console.error("Outstanding suppliers error:", err);
        } finally {
            setLoadingOutstanding(false);
        }
    };

    useEffect(() => {
        loadOutstanding();
    }, [pageOutstanding]);


    // Load Item-Level Report
    useEffect(() => {
        const loadItemReport = async () => {
            try {
                setLoadingItems(true);

                const res = await getSupplierItemsReport({
                    page: pageItems,
                    limit: limitItems,
                    supplierId: selectedSupplier || undefined,
                    supplierSearch: itemSearch || undefined,
                    from,
                    to,
                });

                if (res.success) setItemReport(res);
            } catch (err) {
                console.error("Item-level report error:", err);
            } finally {
                setLoadingItems(false);
            }
        };

        setPageItems(1);
        loadItemReport();
    }, [itemSearch, from, to]);


    // Load Trends
    useEffect(() => {
        const loadTrends = async () => {
            try {
                const res = await getSupplierPurchaseTrends({
                    interval,
                    supplierId: selectedSupplier ?? undefined,
                    from: trendFrom || undefined,
                    to: trendTo || undefined,
                });

                if (res.success) setTrends(res.data);
            } catch (err) {
                console.error("Trends error:", err);
            }
        };

        loadTrends();
    }, [interval, selectedSupplier, trendFrom, trendTo]);


    const summaryCards = summary.length
        ? [
            <KPI
                key="totalSuppliers"
                title="Total Suppliers"
                value={summary.length}
                icon={<Users className="w-6 h-6 text-emerald-400" />}
                iconBg="bg-emerald-500/10"
                gradient="linear-gradient(79.74deg, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0.1) 100%)"
            />,

            <KPI
                key="totalPurchased"
                title="Total Purchased"
                value={formatCurrencyLKR(
                    summary.reduce((a, b) => a + b.totalPurchased, 0),
                    false
                )}
                icon={<TrendingUp className="w-6 h-6 text-cyan-400" />}
                iconBg="bg-cyan-500/10"
                gradient="linear-gradient(79.74deg, rgba(6,182,212,0.15) 0%, rgba(0,0,0,0.1) 100%)"
            />,

            <KPI
                key="totalPaid"
                title="Total Paid"
                value={formatCurrencyLKR(
                    summary.reduce((a, b) => a + b.totalPaid, 0),
                    false
                )}
                icon={<Wallet className="w-6 h-6 text-indigo-400" />}
                iconBg="bg-indigo-500/10"
                gradient="linear-gradient(79.74deg, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0.1) 100%)"
            />,

            <KPI
                key="outstandingBalance"
                title="Total Outstanding"
                value={formatCurrencyLKR(
                    summary.reduce((a, b) => a + b.outstandingBalance, 0),
                    false
                )}
                icon={<FileClock className="w-6 h-6 text-yellow-400" />}
                iconBg="bg-yellow-500/10"
                gradient="linear-gradient(79.74deg, rgba(234,179,8,0.15) 0%, rgba(0,0,0,0.1) 100%)"
            />,

            <KPI
                key="pendingInvoices"
                title="Pending Invoices"
                value={summary.reduce((a, b) => a + b.pendingInvoices, 0)}
                icon={<FileCheck2 className="w-6 h-6 text-purple-400" />}
                iconBg="bg-purple-500/10"
                gradient="linear-gradient(79.74deg, rgba(168,85,247,0.15) 0%, rgba(0,0,0,0.1) 100%)"
            />,
        ]
        : [];

    const SupplierSummaryTableColumns = [
        {
            key: "name",
            label: "Supplier",
            render: (row: ISupplierSummaryItem) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.name}</span>
                    {row.company && (
                        <span className="text-xs text-gray-400">{row.company}</span>
                    )}
                </div>
            ),
        },
        {
            key: "contact",
            label: "Contact",
            render: (row: ISupplierSummaryItem) => (
                <div className="flex flex-col">
                    <span>{row.contact ?? "—"}</span>
                    <span className="text-xs text-gray-400">{row.email ?? ""}</span>
                </div>
            ),
        },
        {
            key: "totalPurchased",
            label: "Total Purchased",
            render: (row: ISupplierSummaryItem) =>
                formatCurrencyLKR(row.totalPurchased, false),
        },
        // {
        //     key: "totalPaid",
        //     label: "Total Paid",
        //     render: (row: ISupplierSummaryItem) =>
        //         formatCurrencyLKR(row.totalPaid, false),
        // },
        {
            key: "outstandingBalance",
            label: "Outstanding",
            render: (row: ISupplierSummaryItem) => (
                <span
                    className={
                        row.outstandingBalance > 0
                            ? "text-red-400 font-semibold"
                            : "text-emerald-400 font-semibold"
                    }
                >
                    {formatCurrencyLKR(row.outstandingBalance, false)}
                </span>
            ),
        },
        {
            key: "invoiceCount",
            label: "Invoices",
            render: (row: ISupplierSummaryItem) => (
                <span>
                    {row.paidInvoices}/{row.invoiceCount}{" "}
                    <span className="text-xs text-gray-400">(paid/total)</span>
                </span>
            ),
        },
        {
            key: "lastPurchaseDate",
            label: "Last Purchase",
            render: (row: ISupplierSummaryItem) => row.lastPurchaseDate ? formatDateTime(row.lastPurchaseDate) : "—"
        },
    ];

    // Supplier Summary – PDF Export Columns
    const supplierSummaryExportColumns = [
        {
            header: "Supplier Info",
            key: "name",
            format: (value: any, row: ISupplierSummaryItem) => {
                const contact = row.contact ? `\n${row.contact}` : "\n—";
                const email = row.email ? `\n${row.email}` : "";

                return `${row.name}${contact}${email}`;
            },
        },

        {
            header: "Total Purchased",
            key: "totalPurchased",
            format: (v: number) => formatCurrencyLKR(v),
        },

        // {
        //     header: "Total Paid",
        //     key: "totalPaid",
        //     format: (v: number) => formatCurrencyLKR(v),
        // },

        {
            header: "Outstanding",
            key: "outstandingBalance",
            format: (v: number) => formatCurrencyLKR(v),
        },

        {
            header: "Invoices",
            key: "invoiceCount",
            format: (value: any, row: ISupplierSummaryItem) =>
                `${row.paidInvoices}/${row.invoiceCount} (paid/total)`,
        },

        {
            header: "Last Purchase",
            key: "lastPurchaseDate",
            format: (v: string | undefined) =>
                v ? formatDateTime(v, { hideTime: true }) : "—",
        },
    ];

    const OutstandingSuppliersTableColumns = [
        {
            key: "name",
            label: "Supplier",
            render: (row: IOutstandingSupplierItem) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.name}</span>
                    <span className="text-xs text-gray-400">{row.email}</span>
                </div>
            ),
        },
        {
            key: "contact",
            label: "Contact",
            render: (row: IOutstandingSupplierItem) => (
                <div className="flex flex-col">
                    <span>{row.contact ?? "—"}</span>
                    <span className="text-xs text-gray-400">{row.email ?? ""}</span>
                </div>
            ),
        },
        {
            key: "outstandingBalance",
            label: "Outstanding",
            render: (row: IOutstandingSupplierItem) => (
                <span className="text-red-400 font-semibold">
                    {formatCurrencyLKR(row.outstandingBalance, false)}
                </span>
            ),
        },
        {
            key: "pendingInvoiceCount",
            label: "Pending Invoices",
            render: (row: IOutstandingSupplierItem) => (
                <span className="font-medium">{row.pendingInvoiceCount}</span>
            ),
        },
        {
            key: "pendingInvoiceTotal",
            label: "Total",
            render: (row: IOutstandingSupplierItem) =>
                formatCurrencyLKR(row.pendingInvoiceTotal, false),
        },
        {
            key: "oldestPendingInvoiceDate",
            label: "Oldest Pending",
            render: (row: IOutstandingSupplierItem) => row.oldestPendingInvoiceDate ? formatDateTime(row.oldestPendingInvoiceDate) : "—",
        },
        {
            key: "newestPendingInvoiceDate",
            label: "Newest Pending",
            render: (row: IOutstandingSupplierItem) => row.newestPendingInvoiceDate ? formatDateTime(row.newestPendingInvoiceDate) : "-",
        },
        {
            key: "status",
            label: "Status",
            render: (row: IOutstandingSupplierItem) => (
                <span
                    className={
                        row.status === "active"
                            ? "text-emerald-400 font-medium"
                            : "text-gray-400 font-medium"
                    }
                >
                    {row.status}
                </span>
            ),
        },
    ];

    const SupplierItemsTableColumns = [
        {
            key: "productName",
            label: "Product",
            render: (row: ISupplierItemReportRow) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.productName}</span>
                    {row.latestBatchCode && (
                        <span className="text-xs text-gray-400">
                            Batch: {row.latestBatchCode}
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: "supplierName",
            label: "Supplier",
            render: (row: ISupplierItemReportRow) => (
                <span>{row.supplierName}</span>
            ),
        },
        {
            key: "totalQty",
            label: "Total Qty",
            render: (row: ISupplierItemReportRow) => (
                <span className="font-medium">{row.totalQty}</span>
            ),
        },
        {
            key: "totalValue",
            label: "Total Value",
            render: (row: ISupplierItemReportRow) =>
                formatCurrencyLKR(row.totalValue, false),
        },
        {
            key: "latestCostPrice",
            label: "Latest Cost",
            render: (row: ISupplierItemReportRow) =>
                formatCurrencyLKR(row.latestCostPrice, false),
        },
        {
            key: "lastBatchDate",
            label: "Last Batch Date",
            render: (row: ISupplierItemReportRow) =>
                row.lastBatchDate ? formatDateTime(row.lastBatchDate) : "—",
        },
    ];

    // Exports
    const supplierItemsExportColumns = [
        {
            header: "Product",
            key: "productName",
            format: (value: any, row: ISupplierItemReportRow) => {
                const batch = row.latestBatchCode ? `\nBatch: ${row.latestBatchCode}` : "";
                return `${row.productName}${batch}`;
            },
        },

        {
            header: "Supplier",
            key: "supplierName",
        },

        {
            header: "Total Qty",
            key: "totalQty",
        },

        {
            header: "Total Value",
            key: "totalValue",
            format: (v: number) => formatCurrencyLKR(v),
        },

        {
            header: "Latest Cost",
            key: "latestCostPrice",
            format: (v: number) => formatCurrencyLKR(v),
        },

        {
            header: "Last Batch Date",
            key: "lastBatchDate",
            format: (v: string | null) =>
                v ? formatDateTime(v) : "—",
        },
    ];


    if (loading) {
        return <div>Loading...</div>;
    }


    return (
        <div className="flex flex-col gap-6">

            {/* KPI Cards */}
            <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {summaryCards}
            </div>

            {/* Mobile Slider */}
            <PaginationSlider>{summaryCards}</PaginationSlider>

            {/* Supplier Summary Table */}
            <ReportSection title="Supplier Summary">
                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-3">

                    {/* Search suppliers */}
                    <SearchField
                        value={searchSummary}
                        onChange={setSearchSummary}
                        placeholder="Search supplier, email, company..."
                        className="w-full md:max-w-xs"
                    />

                    <div className="flex gap-4 w-full items-center justify-end">
                        {/* Date range filter */}
                        <DateRangePicker
                            value={summaryDateRange}
                            onChange={setSummaryDateRange}
                            className="w-full md:max-w-xs"
                        />

                        <ExportPDFButton
                            fileName="supplier_summary_report.pdf"
                            title="Supplier Summary Report"
                            columns={supplierSummaryExportColumns}
                            data={summary ?? []}
                            buttonLabel="Export PDF"
                        />

                    </div>

                </div>

                <DataTable
                    columns={SupplierSummaryTableColumns}
                    data={summary}
                    loading={loadingSummary}
                    pagination={{
                        page: pageSummary,
                        totalPages: totalPagesSummary,
                        total: totalSummary,
                        onPageChange: (newPage) => setPageSummary(newPage),
                    }}
                />
            </ReportSection>

            {/* Outstanding Suppliers Table */}
            {(outstanding?.data && outstanding.data.length > 0) && (
                <ReportSection title="Outstanding Suppliers">
                    <DataTable
                        columns={OutstandingSuppliersTableColumns}
                        data={outstanding.data}
                        loading={loadingOutstanding}
                        pagination={{
                            page: pageOutstanding,
                            totalPages: totalPagesOutstanding,
                            total: totalOutstanding,
                            onPageChange: (newPage) => setPageOutstanding(newPage),
                        }}
                    />
                </ReportSection>
            )}

            {/* Supplier trend chart */}
            <SupplierTrendsChart
                trends={trends}
                interval={interval}
                onIntervalChange={setInterval}
            />

            {/* Supplier Item-Level Report */}
            <ReportSection title="Supplier Item Purchases">

                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-3">

                    {/* Search Supplier */}
                    <SearchField
                        value={itemSearch}
                        onChange={setItemSearch}
                        placeholder="Search supplier by name, email, or phone..."
                        className="w-full md:max-w-xs"
                    />

                    <div className="flex gap-4 w-full items-center justify-end">

                        {/* Date Range Picker */}
                        <DateRangePicker
                            value={dateRange}
                            onChange={setDateRange}
                            className="w-full md:max-w-xs"
                        />

                        {/* EXPORT BUTTON */}
                        <ExportPDFButton
                            fileName="supplier_items_report.pdf"
                            title="Supplier Items Report"
                            columns={supplierItemsExportColumns}
                            data={itemReport?.data ?? []}
                            buttonLabel="Export PDF"
                        />

                    </div>

                </div>

                <DataTable
                    columns={SupplierItemsTableColumns}
                    data={itemReport?.data ?? []}
                    loading={loadingItems}
                    pagination={{
                        page: pageItems,
                        totalPages: totalPagesItems,
                        total: totalItems,
                        onPageChange: (newPage) => setPageItems(newPage),
                    }}
                />
            </ReportSection>
        </div>
    );

};

export default SupplierReports;
