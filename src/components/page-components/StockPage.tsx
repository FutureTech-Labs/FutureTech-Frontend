"use client";

import {
    useState,
    useEffect
} from "react";

import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import Invoice from "../common/Invoice";
import DataTable from "../common/Table";
import DialogBox from "../common/DialogBox";
import IconButton from "../common/IconButton";
import SearchField from "../forms/SearchField";
import { formatCurrencyLKR } from "@/lib/utils";
import PurchaseForm from "../forms/PurchaseForm";
import { StatusBadge } from "../common/StatusBadge";
import { getPurchaseInvoice } from "@/services/purchaseService";
import { deleteBatch, getAllStockBatches } from "@/services/stockService";

const StockPage = () => {
    const [batches, setBatches] = useState<IStockBatch[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [purchaseDialog, setPurchaseDialogOpen] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [batchToDelete, setBatchToDelete] = useState<IStockBatch | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
    const [invoiceData, setInvoiceData] = useState<IPurchaseInvoiceResponse | null>(null);

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

    useEffect(() => {
        fetchStockData();
    }, [page, searchTerm]);

    useEffect(() => {
        if (!selectedInvoiceId) return;

        getPurchaseInvoice(selectedInvoiceId).then((res) => {
            setInvoiceData(res);
        });
    }, [selectedInvoiceId]);


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
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete batch");
        } finally {
            setDeleting(false);
        }
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
                    return <StatusBadge text="Out" color="red" />;

                if (minStock && stock < minStock)
                    return <StatusBadge text={`Low (${stock})`} color="yellow" />;

                return <StatusBadge text={`${stock}`} color="green" />;
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
                        onClick={() => { }}
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


    return (
        <div className="relative flex flex-col gap-6">

            <div className="flex flex-col gap-6 p-5 rounded-xl border-2 border-gradient border-primary-900/40 table-bg-gradient shadow-lg 
            shadow-primary-900/15">

                <div className="flex md:flex-row flex-col gap-5 items-center justify-between w-full">

                    {/* Search filter */}
                    <SearchField
                        placeholder="Search products, brands or categories..."
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onClear={() => setSearchTerm("")}
                        className="md:max-w-md"
                    />
                    <Button
                        onClick={handlePurchase}
                        className="main-button-gradient border-none!"
                    >
                        Purchase Products
                        <Plus />
                    </Button>
                </div>

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
                    {/* Here the purchasing form should come */}
                    <PurchaseForm
                        onSuccess={(data) => {
                            const invoiceId = data.invoice._id;

                            setPurchaseDialogOpen(false);         // close purchase form
                            setSelectedInvoiceId(invoiceId);      // set invoice ID
                            setInvoiceDialogOpen(true);           // open invoice dialog

                            fetchStockData();                     // refresh stock table
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
