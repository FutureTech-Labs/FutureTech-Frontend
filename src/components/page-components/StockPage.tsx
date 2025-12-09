"use client";

import {
    useState,
    useEffect
} from "react";

import { toast } from "sonner";

import {
    updateGlobalStockThreshold,
    getGlobalStockThreshold
} from "@/services/productService";

import {
    deleteBatch,
    getAllStockBatches,
    getStockStats
} from "@/services/stockService";

import {
    getPurchaseInvoice
} from "@/services/purchaseService";

import { formatCurrencyLKR } from "@/lib/utils";

import {
    Plus,
    PackageSearch,
    Boxes, Wallet,
    TrendingUp
} from "lucide-react";

import { Button } from "../ui/button";
import Invoice from "../common/Invoice";
import DataTable from "../common/Table";
import StatCard from "../cards/StatCard";
import DialogBox from "../common/DialogBox";
import IconButton from "../common/IconButton";
import SearchField from "../forms/SearchField";
import PurchaseForm from "../forms/PurchaseForm";
import StockDetails from "../common/StockDetails";
import { StatusBadge } from "../common/StatusBadge";
import PaginationSlider from "../sliders/PaginationSlider";
import ThresholdInput from "@/components/common/ThresholdInput";

const StockPage = () => {
    const [batches, setBatches] = useState<IStockBatch[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const [globalThreshold, setGlobalThreshold] = useState(0);

    const [purchaseDialog, setPurchaseDialogOpen] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [batchToDelete, setBatchToDelete] = useState<IStockBatch | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
    const [invoiceData, setInvoiceData] = useState<IPurchaseInvoiceResponse | null>(null);

    const [stockDetailsDialogOpen, setStockDetailsDialogOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState<IStockBatch | null>(null);

    const [stats, setStats] = useState({
        totalStockValue: 0,
        totalBatches: 0,
        globalThreshold: 0,
        totalPurchaseCostThisMonth: 0
    });

    const fetchStockData = async () => {
        setLoading(true);
        try {
            const stockRes = await getAllStockBatches({
                page,
                limit: 10,
                search: searchTerm || undefined,
            });

            if (stockRes.success) {
                setBatches(stockRes.batches);
                setTotal(stockRes.total);
                setPages(stockRes.pages);
            }

        } catch (error) {
            console.error("Failed to fetch stock:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch global stats (independent of table pagination)
    const fetchStats = async () => {
        try {
            const res = await getStockStats();
            if (res && res.success && res.stats) {
                setStats(res.stats);
                // keep globalThreshold in sync if present
                if (typeof res.stats.globalThreshold === "number") {
                    setGlobalThreshold(res.stats.globalThreshold);
                }
            } else {
                console.warn("getStockStats returned unexpected shape", res);
            }
        } catch (err) {
            console.error("Failed to fetch stock stats", err);
        }
    };

    // Load global threshold on mount
    useEffect(() => {
        (async () => {
            try {
                const res = await getGlobalStockThreshold();
                if (res.success) {
                    setGlobalThreshold(res.settings.minStockThreshold);
                }
            } catch (err) {
                console.error("Failed to load threshold");
            }
            await fetchStats();
        })();
    }, []);

    useEffect(() => {
        fetchStockData();
    }, [page, searchTerm]);

    useEffect(() => {
        if (!selectedInvoiceId) return;

        getPurchaseInvoice(selectedInvoiceId).then((res) => {
            setInvoiceData(res);
        });
    }, [selectedInvoiceId]);

    const handleThresholdUpdate = async (v: number) => {
        try {
            const res = await updateGlobalStockThreshold(v);
            if (res.success) {
                toast.success("Global threshold updated");
                setGlobalThreshold(v);
                await fetchStats();
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update threshold");
        }
    };

    const handlePurchase = () => {
        setPurchaseDialogOpen(true);
    };

    const handleDeleteClick = (batch: IStockBatch) => {
        setBatchToDelete(batch);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!batchToDelete?._id) return;

        setDeleting(true);
        try {
            const res = await deleteBatch(batchToDelete._id);

            if (!res.success) {
                toast.error(res.message);
                return;
            }

            toast.success("Stock batch deleted successfully");

            setDeleteDialogOpen(false);
            setBatchToDelete(null);

            await fetchStockData();
            fetchStats();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete batch");
        } finally {
            setDeleting(false);
        }
    };

    const handleViewBatch = (batch: IStockBatch) => {
        setSelectedBatch(batch);
        setStockDetailsDialogOpen(true);
    };

    const StockColumns = [
        {
            key: "dateReceived",
            label: "Purchased",
            render: (b: IStockBatch) =>
                new Date(b.dateReceived).toLocaleDateString("en-GB"),
        },
        {
            key: "product",
            label: "Product",
            render: (b: IStockBatch) => (
                <div className="max-w-60 truncate">
                    {b.product?.name || "—"}
                </div>
            ),
        },
        {
            key: "supplier",
            label: "Supplier",
            render: (b: IStockBatch) => b.supplier?.name || "—",
        },
        {
            key: "batchCode",
            label: "Batch Code",
            render: (b: IStockBatch) => b.batchCode || "—",
        },
        {
            key: "availableStock",
            label: "Available Stock",
            render: (b: IStockBatch) => {
                const stock = b.quantityAvailable || 0;
                const minStock = b.product?.minStock ?? undefined;

                if (stock === 0)
                    return <StatusBadge text="Out" color="red" />

                if (minStock && stock < minStock)
                    return <StatusBadge text={`Low (${stock})`} color="yellow" />

                return <StatusBadge text={`${stock}`} color="green" />
            },
        },
        {
            key: "costPrice",
            label: "Cost Price",
            render: (b: IStockBatch) => formatCurrencyLKR(b.costPrice),
        },
        {
            key: "actions",
            label: "Actions",
            render: (b: IStockBatch) => (
                <div className="flex gap-1">
                    <IconButton
                        iconSrc="/icons/Eye.svg"
                        ariaLabel="view"
                        onClick={() => handleViewBatch(b)}
                    />

                    <IconButton
                        iconSrc="/icons/Delete.svg"
                        ariaLabel="Delete"
                        onClick={() => handleDeleteClick(b)}
                    />
                </div>
            ),
        },
    ];

    // Stat Cards
    const stockStatCards = [
        <StatCard
            key="stock-value"
            title="Stock Value"
            value={formatCurrencyLKR(stats?.totalStockValue || 0)}
            icon={<Wallet className="w-5 h-5 text-green-400" />}
            iconBg="bg-green-500/10"
            gradient="linear-gradient(79.74deg, rgba(0,255,132,0.15) 0%, rgba(0,0,0,0.12) 100%)"
        />,

        <StatCard
            key="total-batches"
            title="Batches"
            value={stats?.totalBatches || 0}
            icon={<Boxes className="w-5 h-5 text-blue-400" />}
            iconBg="bg-blue-500/10"
            gradient="linear-gradient(79.74deg, rgba(0,128,255,0.15) 0%, rgba(0,0,0,0.12) 100%)"
        />,

        <StatCard
            key="threshold"
            title="Global Threshold"
            value={globalThreshold}
            icon={<PackageSearch className="w-5 h-5 text-purple-400" />}
            iconBg="bg-purple-500/10"
            gradient="linear-gradient(79.74deg, rgba(180,0,255,0.15) 0%, rgba(0,0,0,0.12) 100%)"
        />,

        <StatCard
            key="monthly-cost"
            title="Purchases (This Month)"
            value={formatCurrencyLKR(stats?.totalPurchaseCostThisMonth || 0)}
            icon={<TrendingUp className="w-5 h-5 text-red-400" />}
            iconBg="bg-red-500/10"
            gradient="linear-gradient(79.74deg, rgba(255,0,0,0.15) 0%, rgba(0,0,0,0.12) 100%)"
        />
    ];

    return (
        <div className="relative flex flex-col gap-6">

            {/* Desktop grid */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
                {stockStatCards}
            </div>

            {/* Mobile slider */}
            <PaginationSlider>{stockStatCards}</PaginationSlider>


            <div className="flex flex-col gap-6 p-5 rounded-xl border-2 border-gradient border-primary-900/40 table-bg-gradient 
            shadow-lg shadow-primary-900/15">

                <div className="flex md:flex-row flex-col gap-5 items-center justify-between w-full">

                    {/* Search filter */}
                    <SearchField
                        placeholder="Search products, brands or categories..."
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onClear={() => setSearchTerm("")}
                        className="md:max-w-md"
                    />

                    {/* Minimum Threshold */}
                    <ThresholdInput
                        value={globalThreshold}
                        onSubmit={handleThresholdUpdate}
                    />

                    <Button
                        onClick={handlePurchase}
                        className="main-button-gradient border-none!"
                    >
                        Purchase Products
                        <Plus />
                    </Button>
                </div>

                {/* Table */}
                <DataTable
                    columns={StockColumns}
                    data={batches}
                    loading={loading}
                    pagination={{
                        page,
                        totalPages: pages,
                        onPageChange: (newPage) => setPage(newPage),
                    }}
                />

                {/* Purchase form */}
                <DialogBox
                    open={purchaseDialog}
                    onOpenChange={setPurchaseDialogOpen}
                    title="Product Details"
                    widthClass="min-w-4xl!"
                >
                    <PurchaseForm
                        onSuccess={(data) => {
                            const invoiceId = data.invoice._id;

                            setPurchaseDialogOpen(false);
                            setSelectedInvoiceId(invoiceId);
                            setInvoiceDialogOpen(true);

                            fetchStockData();
                        }}
                        onCancel={() => setPurchaseDialogOpen(false)}
                    />
                </DialogBox>

                {/* Invoice Dialog */}
                <DialogBox
                    open={invoiceDialogOpen}
                    onOpenChange={setInvoiceDialogOpen}
                    title="Purchase Invoice"
                    widthClass="md:min-w-3xl!"
                >
                    {invoiceData && (
                        <Invoice
                            type="purchase"
                            invoice={invoiceData.invoice}
                            items={invoiceData.items}
                        />
                    )}
                </DialogBox>

                {/* Stock Details Dialog */}
                <DialogBox
                    open={stockDetailsDialogOpen}
                    onOpenChange={setStockDetailsDialogOpen}
                    title="Stock Details"
                    widthClass="lg:min-w-3xl!"
                >
                    <StockDetails batch={selectedBatch} />
                </DialogBox>

                {/* Delete Confirmation Dialog */}
                <DialogBox
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    title="Delete Batch"
                    centerTitle
                    showFooter
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="danger"
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteDialogOpen(false)}
                    confirmLoading={deleting}
                >
                    <div className="text-center text-sm text-gray-400 mt-2 whitespace-pre-line">
                        Are you sure you want to delete this stock batch?
                        {"\n"}This will permanently remove the batch, update product stock levels, and cannot be undone.
                    </div>
                </DialogBox>
            </div>
        </div>
    );
};

export default StockPage;
