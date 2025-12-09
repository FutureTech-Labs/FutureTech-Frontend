"use client";

import {
    useState,
    useEffect
} from "react";

import {
    getCurrentStockReport,
    getLowStockReport,
    getStockValueReport,
    getStockMovementReport,
    // getFastMovingProducts,
    // getSlowMovingProducts,
    getBatchAgingReport,
    getBatchListReport,
} from "@/services/Report-Services/inventoryReportServices";

import { formatCurrencyLKR, formatDateTime } from "@/lib/utils";

import {
    DollarSign,
    Package,
    Layers,
    BarChart2
} from "lucide-react";

import KPI from "@/components/cards/KPICard";
import DataTable from "@/components/common/Table";
import SearchField from "@/components/forms/SearchField";
import ReportSection from "@/components/common/ReportsSection";
import ExportPDFButton from "@/components/common/ExportPdfButton";
import { TooltipWrapper } from "@/components/common/TooltipWrapper";
import PaginationSlider from "@/components/sliders/PaginationSlider";
import { StatusBadge, StatusBadgeProps } from "@/components/common/StatusBadge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const InventoryReports = () => {
    // STATES
    const [currentStock, setCurrentStock] = useState<ICurrentStockResponse | null>(null);
    const [lowStock, setLowStock] = useState<ILowStockResponse | null>(null);
    const [stockValue, setStockValue] = useState<IStockValueResponse | null>(null);
    const [stockMovement, setStockMovement] = useState<IStockMovementResponse | null>(null);
    // const [fastMoving, setFastMoving] = useState<IFastMovingResponse | null>(null);
    // const [slowMoving, setSlowMoving] = useState<ISlowMovingResponse | null>(null);
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

    // Stock Movement 
    const [pageStockMovement, setPageStockMovement] = useState(1);
    const [loadingMovement, setLoadingMovement] = useState(true);

    // Batch Aging
    const [pageBatchAging, SetPageBatchAging] = useState(1);
    const [loadingBatchAging, setLoadingBatchAging] = useState(true);

    // Batch List
    const [pageBatchList, setPageBatchList] = useState(1);
    const [loadingBatchList, setLoadingBatchList] = useState(true);

    // Global initial loader
    const [loading, setLoading] = useState(true);


    // INITIAL PARALLEL LOAD
    const loadInitial = async () => {
        try {
            const [
                currentRes,
                lowRes,
                stockValueRes,
                // fastRes,
                // slowRes,
                agingRes,
                batchListRes,
                movementRes
            ] = await Promise.all([
                getCurrentStockReport(),
                getLowStockReport(),
                getStockValueReport(),
                // getFastMovingProducts(),
                // getSlowMovingProducts(),
                getBatchAgingReport(),
                getBatchListReport(),
                getStockMovementReport(),
            ]);

            setCurrentStock(currentRes);
            setLowStock(lowRes);
            setStockValue(stockValueRes);
            // setFastMoving(fastRes);
            // setSlowMoving(slowRes);
            setBatchAging(agingRes);
            setBatchList(batchListRes);
            setStockMovement(movementRes);
        } catch (err) {
            console.error("Initial inventory load failed:", err);
        } finally {
            setLoading(false);
            setLoadingCurrent(false);
            setLoadingLow(false);
            setLoadingStockValue(false);
            setLoadingMovement(false);
            setLoadingBatchAging(false);
            setLoadingBatchList(false);
        }
    };

    useEffect(() => {
        loadInitial();
    }, []);

    // PAGINATION LOADERS
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
        setLoadingBatchList(true);
        try {
            const res = await getBatchListReport({ page: pageBatchList });
            setBatchList(res);
        } catch (err) {
            console.error("Load batch list failed:", err);
        } finally {
            setLoadingBatchList(false);
        }
    };


    const loadStockMovement = async () => {
        setLoadingMovement(true);
        try {
            const res = await getStockMovementReport({
                page: pageStockMovement,
            });
            setStockMovement(res);
        } catch (err) {
            console.error("Load stock movement failed:", err);
        } finally {
            setLoadingMovement(false);
        }
    };

    // PAGINATION TRIGGERS
    useEffect(() => { loadCurrentStock() }, [pageCurrent]);
    useEffect(() => { loadLowStock() }, [pageLow, lowSearch]);
    useEffect(() => { loadStockValue() }, [pageStockValue]);
    useEffect(() => { loadBatchList() }, [pageBatchList]);
    useEffect(() => { loadStockMovement() }, [pageStockMovement]);

    // PRE-RENDER
    if (loading) return <div>Loading...</div>;

    // KPI CALCULATIONS
    const totalBatches = currentStock?.meta.totalBatches ?? 0;
    const totalProducts = currentStock?.meta.totalProducts ?? 0;
    const totalStockValue = currentStock?.meta.totalStockValue ?? 0;
    const totalQuantityAvailable = currentStock?.meta.totalQuantityAvailable ?? 0;

    // TABLE COLUMNS

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

    // Current stock exports
    const currentStockExportColumns = [
        {
            header: "Product",
            key: "name",
        },
        {
            header: "Category",
            key: "category.name",
            format: (value: string) => value ?? "—",
        },
        {
            header: "Available Qty",
            key: "availableFromBatches",
        },
        {
            header: "Min Stock",
            key: "minStock",
        },
        {
            header: "Batches",
            key: "batchesCount",
            format: (value: string) => `${value} batches`,
        },
        {
            header: "Stock Value (Rs.)",
            key: "stockValue",
            format: (value: number) => formatCurrencyLKR(value),
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
                <InfoBadge text={row.category?.name ?? "—"} color="purple" />
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
            render: (row: IStockValueItem) =>
                <InfoBadge text={row.category?.name ?? "—"} color="purple" />
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

        {
            key: "batches",
            label: "Breakdown",
            render: (row: IStockValueItem) => {
                const activeBatches = row.batches.filter(b => b.qtyAvailable > 0);
                if (activeBatches.length === 0) return "—";

                return (
                    <Accordion type="single" collapsible>
                        <AccordionItem value="batch-breakdown">
                            <AccordionTrigger className="text-xs px-2 py-1">
                                {activeBatches.length} Active Batches
                            </AccordionTrigger>

                            <AccordionContent>
                                <div className="flex flex-col gap-3">
                                    {activeBatches.map((b, i) => (
                                        <div
                                            key={i}
                                            className="text-xs px-3 py-2 rounded bg-primary-900/20 border border-primary-900/40"
                                        >

                                            {/* Batch header: code + qty */}
                                            <div className="flex justify-between font-medium mb-1">
                                                <span>{b.batchCode}</span>
                                                <span>{b.qtyAvailable} pcs</span>
                                            </div>

                                            {/* Cost Price */}
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>Cost Price</span>
                                                <span>{formatCurrencyLKR(b.costPrice)}</span>
                                            </div>

                                            {/* Batch Value */}
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>Batch Value</span>
                                                <span>{formatCurrencyLKR(b.batchValue)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                );
            }
        }


    ];

    // Stock value exports
    const stockValueExportColumns = [
        {
            header: "Product",
            key: "name",
        },
        {
            header: "Category",
            key: "category.name",
            format: (value?: string) => value ?? "—",
        },
        {
            header: "Available Qty",
            key: "qtyAvailable",
        },
        {
            header: "Batches",
            key: "batchesCount",
        },
        {
            header: "Breakdown",
            key: "batches",
            format: (value: IStockValueBatch[], row: IStockValueItem) => {
                if (!value || value.length === 0) return "—";

                return value
                    .filter(b => b.qtyAvailable > 0)
                    .map(b => {
                        const cost = formatCurrencyLKR(b.costPrice);
                        const total = formatCurrencyLKR(b.batchValue);

                        return (
                            `${b.batchCode}:\n` +
                            `${b.qtyAvailable} pcs left\n` +
                            `Cost price: ${cost}\n` +
                            `Total Value: ${total}`
                        );
                    })
                    .join("\n\n");
            },
        },
        {
            header: "Stock Value (Rs.)",
            key: "value",
            format: (value: number) => formatCurrencyLKR(value),
        },
    ];

    // Stock movement table columns
    const stockMovementColumns = [
        {
            key: "name",
            label: "Product",
            render: (row: IStockMovementItem) => (
                <span className="font-medium">{row.name}</span>
            ),
        },

        {
            key: "category",
            label: "Category",
            render: (row: IStockMovementItem) =>
                <InfoBadge text={row.category?.name ?? "—"} color="purple" />
        },

        // Purchased
        {
            key: "purchased",
            label: "Purchased",
            render: (row: IStockMovementItem) => (
                <StatusBadge
                    text={row.purchased.toString()}
                    color={row.purchased > 0 ? "green" : "gray"}
                />
            ),
        },

        // Sold
        {
            key: "sold",
            label: "Sold",
            render: (row: IStockMovementItem) => (
                <div className="flex items-center gap-2">
                    <StatusBadge
                        text={row.sold.toString()}
                        color={row.sold > 0 ? "red" : "gray"}
                    />

                    {row.sold > 0 && (
                        <span className="text-xs text-muted-foreground">
                            from {row.soldBatches.length} batches
                        </span>
                    )}
                </div>
            ),
        },

        // Returned
        {
            key: "returned",
            label: "Returned",
            render: (row: IStockMovementItem) => (
                <StatusBadge
                    text={row.returned.toString()}
                    color={row.returned > 0 ? "yellow" : "gray"}
                />
            ),
        },

        // Sold Batch breakdown (expandable)
        {
            key: "soldBatches",
            label: "Sold Batches",
            render: (row: IStockMovementItem) => (
                row.soldBatches.length === 0 ? (
                    "—"
                ) : (
                    <div className="flex flex-col gap-1">
                        {row.soldBatches.map((b, i) => (
                            <div
                                key={i}
                                className="text-xs px-2 py-1 rounded bg-primary-900/20 border border-primary-900/40"
                            >
                                {b.batchCode} — {b.qty} pcs
                            </div>
                        ))}
                    </div>
                )
            ),
        },
    ];

    // Stock movement exports
    const stockMovementExportColumns = [
        {
            header: "Product",
            key: "name",
        },
        {
            header: "Category",
            key: "category.name",
        },
        {
            header: "Purchased",
            key: "purchased",
        },
        {
            header: "Sold",
            key: "sold",
        },
        {
            header: "Returned",
            key: "returned",
        },
        {
            header: "Batch Breakdown",
            key: "soldBatches",
            format: (value: IStockMovementSoldBatch[]) =>
                value.length === 0
                    ? "—"
                    : value.map((b) => `${b.batchCode} (${b.qty})`).join(", "),
        },
    ];

    // Batch Aging table columns
    const batchAgingColumns = [
        {
            key: "product",
            label: "Product",
            render: (row: IBatchAgingItem) => (
                <div className="flex flex-col">
                    {/* Product Name */}
                    <span className="font-medium">{row.product?.name ?? "—"}</span>

                    {/* Batch Code BELOW Product */}
                    <span className="text-xs text-gray-400">
                        {row.batchCode ? `Batch: ${row.batchCode}` : ""}
                    </span>
                </div>
            ),
        },

        {
            key: "supplier",
            label: "Supplier",
            render: (row: IBatchAgingItem) => row.supplier?.name ?? "—",
        },

        {
            key: "costPrice",
            label: "Cost Price",
            render: (row: IBatchAgingItem) => formatCurrencyLKR(row.costPrice),
        },

        {
            key: "quantityReceived",
            label: "Received",
        },

        {
            key: "quantityAvailable",
            label: "Available",
            render: (row: IBatchAgingItem) => (
                <StatusBadge
                    text={row.quantityAvailable.toString()}
                    color={row.quantityAvailable > 0 ? "green" : "red"}
                />
            ),
        },

        {
            key: "dateReceived",
            label: "Received On",
            render: (row: IBatchAgingItem) => {
                return (
                    <TooltipWrapper content={`Age: ${row.ageDays} days`}>
                        {formatDateTime(row.dateReceived)}
                    </TooltipWrapper>
                );
            },
        },
    ];

    // Batch aging exports
    const batchAgingExportColumns = [
        {
            header: "Product",
            key: "product.name",
            format: (_: any, row: IBatchAgingItem) => {
                const product = row.product?.name ?? "—";
                const batch = row.batchCode ?? "—";
                return `${product}\nBatch: ${batch}`;
            },
        },

        {
            header: "Supplier",
            key: "supplier.name",
            format: (v: any) => v ?? "—",
        },

        {
            header: "Cost Price (Rs.)",
            key: "costPrice",
            format: (v: any) => formatCurrencyLKR(v),
        },

        {
            header: "Received Qty",
            key: "quantityReceived",
        },

        {
            header: "Available Qty",
            key: "quantityAvailable",
        },

        {
            header: "Received On",
            key: "dateReceived",
            format: (v: any) => formatDateTime(v),
        },

        {
            header: "Age (days)",
            key: "ageDays",
        },
    ];

    // Batch List table columns
    const batchListColumns = [
        {
            key: "productDisplay",
            label: "Product",
            render: (row: IBatchListItem) => (
                <div className="flex flex-col">
                    <span className="font-medium">
                        {row.product?.name ?? "—"}
                    </span>

                    {row.batchCode && (
                        <span className="text-xs text-gray-400">
                            Batch: {row.batchCode}
                        </span>
                    )}
                </div>
            ),
        },

        {
            key: "supplier",
            label: "Supplier",
            render: (row: IBatchListItem) =>
                row.supplier?.name ?? "—",
        },

        {
            key: "costPrice",
            label: "Cost Price",
            render: (row: IBatchListItem) =>
                formatCurrencyLKR(row.costPrice),
        },

        {
            key: "quantityReceived",
            label: "Received",
            render: (row: IBatchListItem) => row.quantityReceived,
        },

        {
            key: "invoiceNumber",
            label: "Invoice",
            render: (row: IBatchListItem) => row.invoiceNumber || "—",
        },

        {
            key: "dateReceived",
            label: "Received On",
            render: (row: IBatchListItem) =>
                formatDateTime(row.dateReceived),
        },
    ];

    // Batch list exports
    const batchListExportColumns = [
        {
            header: "Product",
            key: "product.name",
            format: (value: string | undefined, row: IBatchListItem) =>
                `${value ?? "—"}${row.batchCode ? `\nBatch: ${row.batchCode}` : ""
                }`,
        },
        {
            header: "Supplier",
            key: "supplier.name",
            format: (value: string | undefined) => value ?? "—",
        },
        {
            header: "Cost Price",
            key: "costPrice",
            format: (value: number) => formatCurrencyLKR(value),
        },
        {
            header: "Received Qty",
            key: "quantityReceived",
            format: (value: number) => `${value} pcs`,
        },
        {
            header: "Invoice No.",
            key: "invoiceNumber",
            format: (value: string | undefined) => value || "—",
        },
        {
            header: "Received On",
            key: "dateReceived",
            format: (value: string) => formatDateTime(value),
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
            <ReportSection title="Current Stock Overview"
                right={
                    <ExportPDFButton
                        fileName="current-stock.pdf"
                        title="Current Stock Report"
                        columns={currentStockExportColumns}
                        data={currentStock?.data ?? []}
                        buttonLabel="Export PDF"
                    />
                }
            >
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
            <ReportSection title="Stock Value Overview"
                right={
                    <ExportPDFButton
                        data={stockValue?.data ?? []}
                        columns={stockValueExportColumns}
                        fileName="stock_value_report.pdf"
                        title="Stock Value Report"
                        buttonLabel="Export PDF"
                    />
                }
            >
                {/* <StockValueChart data={stockValue?.data ?? []} /> */}

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
            </ReportSection>


            {/* STOCK MOVEMENT */}
            <ReportSection
                title="Stock Movement Overview"
                right={
                    <ExportPDFButton
                        fileName="stock_movement_report.pdf"
                        title="Stock Movement Report"
                        columns={stockMovementExportColumns}
                        data={stockMovement?.data ?? []}
                        buttonLabel="Export PDF"
                    />
                }
            >
                <DataTable
                    columns={stockMovementColumns}
                    data={stockMovement?.data ?? []}
                    loading={loadingMovement}
                    pagination={{
                        page: pageStockMovement,
                        totalPages: Math.ceil((stockMovement?.meta.total ?? 0) /
                            (stockMovement?.meta.limit ?? 10)),
                        total: stockMovement?.meta.total ?? 0,
                        onPageChange: setPageStockMovement,
                    }}
                />
            </ReportSection>


            {/* Batch Aging */}
            <ReportSection
                title="Batch Aging Report"
                right={
                    <ExportPDFButton
                        fileName="batch-aging-report.pdf"
                        title="Batch Aging Report"
                        subtitle="Aging summary of active batches"
                        data={batchAging?.data ?? []}
                        columns={batchAgingExportColumns}
                        buttonLabel="Export PDF"
                    />
                }
            >
                <DataTable
                    columns={batchAgingColumns}
                    data={batchAging?.data ?? []}
                    loading={loadingBatchAging}
                    pagination={{
                        page: pageBatchAging,
                        totalPages: Math.ceil(
                            (batchAging?.meta.total ?? 0) /
                            (batchAging?.meta.limit ?? 10)
                        ),
                        total: batchAging?.meta.total ?? 0,
                        onPageChange: SetPageBatchAging,
                    }}
                />
            </ReportSection>


            {/* Batch Lists */}
            <ReportSection
                title="Batch List"
                right={
                    <ExportPDFButton
                        fileName="batch-list-report.pdf"
                        title="Batch List Report"
                        columns={batchListExportColumns}
                        data={batchList?.data ?? []}
                        buttonLabel="Export PDF"
                    />
                }
            >
                <DataTable
                    columns={batchListColumns}
                    data={batchList?.data ?? []}
                    loading={loadingBatchList}
                    pagination={{
                        page: pageBatchList,
                        totalPages: Math.ceil(
                            (batchList?.meta.total ?? 0) /
                            (batchList?.meta.limit ?? 10)
                        ),
                        total: batchList?.meta.total ?? 0,
                        onPageChange: setPageBatchList,
                    }}
                />
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
