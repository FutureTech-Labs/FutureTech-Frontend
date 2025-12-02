"use client";

import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { formatCurrencyLKR, formatLocalDate } from "@/lib/utils";

import {
    getCurrentStockReport,
    getLowStockReport,
    getStockValueReport,
    getStockMovementReport,
    getFastMovingProducts,
    getSlowMovingProducts,
    getBatchAgingReport,
    getBatchListReport,
} from "@/services/Report-Services/inventoryReportServices";

import KPI from "@/components/cards/KPICard";
import DataTable from "@/components/common/Table";
import PaginationSlider from "@/components/sliders/PaginationSlider";
import { DollarSign, Package, Layers, BarChart2 } from "lucide-react";
import { StatusBadge, StatusBadgeProps } from "@/components/common/StatusBadge";
import SearchField from "@/components/forms/SearchField";
import StockValueChart from "@/components/charts/inventory-report-charts/StockValueChart";
import ReportSection from "@/components/common/ReportsSection";

const InventoryReports = () => {
    // -----------------------------
    // 1. STATES
    // -----------------------------
    const [currentStock, setCurrentStock] = useState<ICurrentStockResponse | null>(null);
    const [lowStock, setLowStock] = useState<ILowStockResponse | null>(null);
    const [stockValue, setStockValue] = useState<IStockValueResponse | null>(null);
    const [stockMovement, setStockMovement] = useState<IStockMovementResponse | null>(null);
    const [fastMoving, setFastMoving] = useState<IFastMovingResponse | null>(null);
    const [slowMoving, setSlowMoving] = useState<ISlowMovingResponse | null>(null);
    const [batchAging, setBatchAging] = useState<IBatchAgingResponse | null>(null);
    const [batchList, setBatchList] = useState<IBatchListResponse | null>(null);

    // Pagination states
    const [pageCurrent, setPageCurrent] = useState(1);
    const [loadingCurrent, setLoadingCurrent] = useState(true);

    const [pageLow, setPageLow] = useState(1);
    const [loadingLow, setLoadingLow] = useState(true);
    const [lowSearch, setLowSearch] = useState("");

    // Stock Value pagination + loader
    const [pageStockValue, setPageStockValue] = useState(1);
    const [loadingStockValue, setLoadingStockValue] = useState(true);


    const [pageBatchList, setPageBatchList] = useState(1);
    const [pageMovement, setPageMovement] = useState(1);

    // Date range for Stock Movement
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [from, setFrom] = useState<string>("");
    const [to, setTo] = useState<string>("");

    // Global initial loader
    const [loading, setLoading] = useState(true);

    // Table-specific loader

    // -----------------------------
    // 2. INITIAL PARALLEL LOAD
    // -----------------------------
    const loadInitial = async () => {
        try {
            const [
                currentRes,
                lowRes,
                stockValueRes,
                fastRes,
                slowRes,
                agingRes,
                batchListRes
            ] = await Promise.all([
                getCurrentStockReport(),
                getLowStockReport(),
                getStockValueReport(),
                getFastMovingProducts(),
                getSlowMovingProducts(),
                getBatchAgingReport(),
                getBatchListReport(),
            ]);

            setCurrentStock(currentRes);
            setLowStock(lowRes);
            setStockValue(stockValueRes);
            setFastMoving(fastRes);
            setSlowMoving(slowRes);
            setBatchAging(agingRes);
            setBatchList(batchListRes);
        } catch (err) {
            console.error("Initial inventory load failed:", err);
        } finally {
            setLoading(false);
            setLoadingCurrent(false);
            setLoadingLow(false);
            setLoadingStockValue(false);
        }
    };

    useEffect(() => {
        loadInitial();
    }, []);

    // -----------------------------
    // 3. PAGINATION LOADERS
    // -----------------------------
    const loadCurrentStock = async () => {
        if (loading) return;
        setLoadingCurrent(true);
        try {
            const res = await getCurrentStockReport({ page: pageCurrent });
            setCurrentStock(res);
        } catch (err) {
            console.error("Load current stock failed:", err);
        } finally {
            setLoadingCurrent(false);
        }
    };

    const loadLowStock = async () => {
        if (loading) return;
        setLoadingLow(true);
        try {
            const res = await getLowStockReport({
                page: pageLow,
                search: lowSearch || undefined,
            });
            setLowStock(res);
        } catch (err) {
            console.error("Load low stock failed:", err);
        } finally {
            setLoadingLow(false);
        }
    };

    const loadStockValue = async () => {
        if (loading) return;
        setLoadingStockValue(true);
        try {
            const res = await getStockValueReport({ page: pageStockValue });
            setStockValue(res);
        } catch (err) {
            console.error("Load stock value failed:", err);
        } finally {
            setLoadingStockValue(false);
        }
    };


    const loadBatchList = async () => {
        try {
            const res = await getBatchListReport({ page: pageBatchList });
            setBatchList(res);
        } catch (err) {
            console.error("Load batch list failed:", err);
        }
    };

    const loadStockMovement = async () => {
        try {
            const res = await getStockMovementReport({
                from,
                to,
                page: pageMovement,
            });
            setStockMovement(res);
        } catch (err) {
            console.error("Load stock movement failed:", err);
        }
    };

    // -----------------------------
    // 4. PAGINATION TRIGGERS
    // -----------------------------
    useEffect(() => { loadCurrentStock() }, [pageCurrent]);
    useEffect(() => { loadLowStock() }, [pageLow, lowSearch]);
    useEffect(() => { loadStockValue() }, [pageStockValue]);
    useEffect(() => { loadBatchList() }, [pageBatchList]);
    useEffect(() => { loadStockMovement() }, [pageMovement, from, to]);

    // -----------------------------
    // 5. DATE RANGE SYNC
    // -----------------------------
    useEffect(() => {
        setFrom(formatLocalDate(dateRange?.from));
        setTo(formatLocalDate(dateRange?.to));
    }, [dateRange]);

    // -----------------------------
    // 6. PRE-RENDER
    // -----------------------------
    if (loading) return <div>Loading...</div>;

    // -----------------------------
    // 7. KPI CALCULATIONS (UNCHANGED)
    // -----------------------------
    const totalProducts = currentStock?.meta.totalProducts ?? 0;
    const totalStockValue = currentStock?.meta.totalStockValue ?? 0;
    const totalBatches = currentStock?.meta.totalBatches ?? 0;
    const totalQuantityAvailable = currentStock?.meta.totalQuantityAvailable ?? 0;


    // -----------------------------
    // 8. TABLE COLUMNS
    // -----------------------------
    // Current stock table columns
    const currentStockColumns = [
        {
            key: "name",
            label: "Product",
            render: (row: ICurrentStockItem) => <span className="font-medium">{row.name}</span>,
        },
        {
            key: "category",
            label: "Category",
            render: (row: ICurrentStockItem) => <InfoBadge text={row.category?.name ?? "—"} color="purple" />
        },
        {
            key: "availableFromBatches",
            label: "Available Qty",
            render: (row: ICurrentStockItem) => <QuantityBadge qty={row.availableFromBatches} min={row.minStock} />
        },
        {
            key: "minStock",
            label: "Min Stock",
            render: (row: ICurrentStockItem) => row.minStock,
        },
        {
            key: "batchesCount",
            label: "Batches",
            render: (row: ICurrentStockItem) => <InfoBadge text={`${row.batchesCount} batches`} color="teal" />
        },
        {
            key: "stockValue",
            label: "Stock Value (Rs.)",
            render: (row: ICurrentStockItem) => formatCurrencyLKR(row.stockValue),
        },
    ];


    // Low stock table Columns
    const lowStockColumns = [
        {
            key: "name",
            label: "Product",
            render: (row: ILowStockProduct) => (
                <span className="font-medium">{row.name}</span>
            ),
        },
        {
            key: "category",
            label: "Category",
            render: (row: ILowStockProduct) =>
                row.category?.name ?? "—",
        },
        {
            key: "totalStock",
            label: "Stock",
            render: (row: ILowStockProduct) => {
                const stock = row.totalStock ?? 0;
                const min = row.minStock ?? 0;

                if (stock === 0)
                    return <StatusBadge text="Out of Stock" color="red" />;

                if (stock < min)
                    return (
                        <StatusBadge
                            text={`Low (${stock})`}
                            color="yellow"
                        />
                    );

                return <StatusBadge text={stock.toString()} color="green" />;
            },
        },
        {
            key: "minStock",
            label: "Min Stock",
            render: (row: ILowStockProduct) => row.minStock,
        },
    ];

    // Stock Value table columns
    const stockValueColumns = [
        {
            key: "name",
            label: "Product",
            render: (row: IStockValueItem) => (
                <span className="font-medium">{row.name}</span>
            ),
        },
        {
            key: "category",
            label: "Category",
            render: (row: IStockValueItem) => row.category?.name ?? "—",
        },
        {
            key: "qtyAvailable",
            label: "Available Qty",
            enableSorting: true,
        },
        {
            key: "batchesCount",
            label: "Batches",
        },
        {
            key: "value",
            label: "Stock Value (Rs.)",
            enableSorting: true,
            render: (row: IStockValueItem) => formatCurrencyLKR(row.value),
        },
    ];

    // KPI cards
    const kpiCards = [
        // Total Stock Value
        <KPI
            key="totalStockValue"
            title="Total Inventory Value"
            value={totalStockValue.toLocaleString("en-US")}
            icon={<DollarSign className="w-6 h-6 text-emerald-400" />}
            iconBg="bg-emerald-500/10"
            gradient="linear-gradient(79.74deg, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0.1) 100%)"
        />,

        // Total Products
        <KPI
            key="totalProducts"
            title="Total Products"
            value={totalProducts}
            icon={<Package className="w-6 h-6 text-cyan-400" />}
            iconBg="bg-cyan-500/10"
            gradient="linear-gradient(79.74deg, rgba(6, 182, 212, 0.15) 0%, rgba(0,0,0,0.1) 100%)"
        />,

        // Total Batches
        <KPI
            key="totalBatches"
            title="Total Batches"
            value={totalBatches}
            icon={<Layers className="w-6 h-6 text-purple-400" />}
            iconBg="bg-purple-500/10"
            gradient="linear-gradient(79.74deg, rgba(168, 85, 247, 0.15) 0%, rgba(0,0,0,0.1) 100%)"
        />,

        // Total Quantity Available
        <KPI
            key="totalQuantity"
            title="Total Quantity Available"
            value={totalQuantityAvailable}
            icon={<BarChart2 className="w-6 h-6 text-yellow-400" />}
            iconBg="bg-yellow-500/10"
            gradient="linear-gradient(79.74deg, rgba(234, 179, 8, 0.15) 0%, rgba(0,0,0,0.1) 100%)"
        />,
    ];


    return (
        <div className="flex flex-col gap-6">
            {/* KPI Cards */}
            <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards}
            </div>

            {/* Mobile Slider */}
            <PaginationSlider>{kpiCards}</PaginationSlider>

            {/* CURRENT STOCK TABLE SECTION */}
            <ReportSection title="Current Stock Overview">
                <DataTable
                    columns={currentStockColumns}
                    data={currentStock?.data ?? []}
                    loading={loadingCurrent}
                    pagination={{
                        page: pageCurrent,
                        totalPages: Math.ceil((currentStock?.meta.total ?? 0) / (currentStock?.meta.limit ?? 10)),
                        total: currentStock?.meta.total ?? 0,
                        onPageChange: setPageCurrent,
                    }}
                />
            </ReportSection>


            {/* LOW STOCK SECTION */}
            <ReportSection
                title="Low Stock Products"
                right={
                    <SearchField
                        placeholder="Search low stock products..."
                        value={lowSearch}
                        onChange={setLowSearch}
                        onClear={() => setLowSearch("")}
                        className="max-w-xs"
                    />
                }
            >
                <DataTable
                    columns={lowStockColumns}
                    data={lowStock?.data ?? []}
                    loading={loadingLow}
                    pagination={{
                        page: pageLow,
                        totalPages: Math.ceil((lowStock?.meta.total ?? 0) / (lowStock?.meta.limit ?? 10)),
                        total: lowStock?.meta.total ?? 0,
                        onPageChange: setPageLow,
                    }}
                />
            </ReportSection>


            {/* Stock Value section */}
            <ReportSection title="Stock Value Overview">
                <div className="flex flex-col lg:flex-row gap-6">
                    <DataTable
                        columns={stockValueColumns}
                        data={stockValue?.data ?? []}
                        loading={loadingStockValue}
                        pagination={{
                            page: pageStockValue,
                            totalPages: Math.ceil((stockValue?.meta.total ?? 0) / (stockValue?.meta.limit ?? 10)),
                            total: stockValue?.meta.total ?? 0,
                            onPageChange: setPageStockValue,
                        }}
                    />
                    <StockValueChart data={stockValue?.data ?? []} />
                </div>
            </ReportSection>
        </div>
    );
};

export default InventoryReports;


const InfoBadge = ({
    text,
    color = "gray",
}: {
    text: string;
    color?: StatusBadgeProps["color"];
}) => {
    return <StatusBadge text={text} color={color} />;
};

const QuantityBadge = ({ qty, min }: { qty: number; min?: number }) => {
    let color: StatusBadgeProps["color"] = "green";

    if (qty === 0) color = "red";
    else if (min && qty < min) color = "yellow";

    return (
        <StatusBadge
            text={String(qty)}
            color={color}
        />
    );
};


