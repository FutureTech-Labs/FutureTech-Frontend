"use client";

import {
    useEffect,
    useState
} from "react";

import {
    getAllPurchases,
    getPurchaseInvoice,
    getPurchaseStats,
} from "@/services/purchaseService";

import { DateRange } from "react-day-picker";

import {
    formatCurrencyLKR,
    normalizeDateRange,
    formatDateTime
} from "@/lib/utils";

import {
    Receipt,
    ReceiptText,
    Timer,
    CircleDollarSign,
    BellRing
} from "lucide-react";

import DataTable from "@/components/common/Table";
import Invoice from "@/components/common/Invoice";
import DialogBox from "@/components/common/DialogBox";
import IconButton from "@/components/common/IconButton";
import SearchField from "@/components/forms/SearchField";
import { DateRangePicker } from "@/components/common/DateRangePicker";
import StatCard from "../cards/StatCard";
import PaginationSlider from "../sliders/PaginationSlider";


const PurchaseInvoicePage = () => {
    // Table state
    const [invoices, setInvoices] = useState<IPurchaseInvoice[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [searchValue, setSearchValue] = useState("");

    // Dialog state
    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);

    const [selectedInvoice, setSelectedInvoice] = useState<IPurchaseInvoice | null>(null);
    const [selectedItems, setSelectedItems] = useState<IPurchaseInvoiceItem[]>([]);

    const [stats, setStats] = useState<IPurchaseStats>({
        totalPurchasesAmount: 0,
        totalPurchaseInvoices: 0,
        pendingInvoices: 0,
        outstandingSupplierBalance: 0,
        upcomingDuePayments: 0
    });

    useEffect(() => {
        const { from, to } = normalizeDateRange(dateRange);
        setFrom(from);
        setTo(to);
    }, [dateRange]);

    // Fetch invoices
    const fetchInvoices = async (selectedPage: number = 1) => {
        try {
            setLoading(true);

            const params: any = { page: selectedPage };
            if (from) params.from = from;
            if (to) params.to = to;
            if (searchValue.trim()) params.invoiceNumber = searchValue.trim();

            const res = await getAllPurchases(params);

            setInvoices(res.data ?? []);
            setTotal(res.meta.total);
            setTotalPages(Math.ceil(res.meta.total / res.meta.limit));
        } catch (err) {
            console.error("Failed to fetch purchase invoices", err);
        } finally {
            setLoading(false);
        }
    };

    // Load when date or search changes
    useEffect(() => {
        fetchInvoices(1);
    }, [from, to, searchValue]);

    // Open invoice dialog
    const openInvoice = async (invoiceId: string) => {
        try {
            setDialogLoading(true);
            const res = await getPurchaseInvoice(invoiceId);

            setSelectedInvoice(res.invoice);
            setSelectedItems(res.items);
            setInvoiceDialogOpen(true);
        } catch (error) {
            console.error("Could not load invoice", error);
        } finally {
            setDialogLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await getPurchaseStats();
            if (res.success) setStats(res.stats);
        } catch (err) {
            console.error("Failed to load purchase stats", err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);


    // Table Columns
    const columns = [
        {
            key: "invoiceNumber",
            label: "Invoice ID",
            render: (row: IPurchaseInvoice) => row.invoiceNumber,
        },
        {
            key: "supplier",
            label: "Supplier",
            render: (row: IPurchaseInvoice) => row.supplier?.name ?? "—",
        },
        {
            key: "totalAmount",
            label: "Amount",
            render: (row: IPurchaseInvoice) => formatCurrencyLKR(row.totalAmount),
        },
        {
            key: "status",
            label: "Status",
            render: (row: IPurchaseInvoice) => row.status,
        },
        {
            key: "date",
            label: "Date",
            render: (row: IPurchaseInvoice) => formatDateTime(row.date)
        },
        {
            key: "actions",
            label: "Actions",
            render: (row: IPurchaseInvoice) => (
                <IconButton
                    iconSrc="/icons/Eye.svg"
                    ariaLabel="view"
                    onClick={() => openInvoice(row._id)}
                />
            ),
        },
    ];

    // Stat Cards
    const purchaseStatCards = [
        <StatCard
            key="total-purchases"
            title="Total Purchases Amount"
            value={formatCurrencyLKR(stats.totalPurchasesAmount)}
            icon={<CircleDollarSign className="w-5 h-5 text-green-400" />}
            iconBg="bg-green-500/10"
            gradient="linear-gradient(79.74deg, rgba(0,255,132,0.15) 0%, rgba(0,0,0,0.12) 100%)"
        />,

        // <StatCard
        //     key="total-invoices"
        //     title="Total Purchase Invoices"
        //     value={stats.totalPurchaseInvoices}
        //     icon={<ReceiptText className="w-5 h-5 text-blue-400" />}
        //     iconBg="bg-blue-500/10"
        //     gradient="linear-gradient(79.74deg, rgba(0,128,255,0.15) 0%, rgba(0,0,0,0.12) 100%)"
        // />,

        <StatCard
            key="pending-invoices"
            title="Pending Invoices"
            value={stats.pendingInvoices}
            icon={<Receipt className="w-5 h-5 text-yellow-400" />}
            iconBg="bg-yellow-500/10"
            gradient="linear-gradient(79.74deg, rgba(255,165,0,0.15) 0%, rgba(0,0,0,0.12) 100%)"
        />,

        <StatCard
            key="outstanding-balance"
            title="Outstanding Supplier Balance"
            value={formatCurrencyLKR(stats.outstandingSupplierBalance)}
            icon={<Timer className="w-5 h-5 text-purple-400" />}
            iconBg="bg-purple-500/10"
            gradient="linear-gradient(79.74deg, rgba(128,0,255,0.15) 0%, rgba(0,0,0,0.12) 100%)"
        />,

        <StatCard
            key="due-payments"
            title="Upcoming Due Payments"
            value={stats.upcomingDuePayments}
            icon={<BellRing className="w-5 h-5 text-red-400" />}
            iconBg="bg-red-500/10"
            gradient="linear-gradient(79.74deg, rgba(255,0,0,0.15) 0%, rgba(0,0,0,0.12) 100%)"
        />
    ];

    return (
        <div className="flex flex-col gap-6">

            {/* Stat Cards */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-4 gap-6 w-full mb-2">
                {purchaseStatCards}
            </div>

            {/* Mobile slider */}
            <PaginationSlider>{purchaseStatCards}</PaginationSlider>

            <div className="flex flex-col gap-6 p-5 rounded-xl border-2 border-gradient border-primary-900/40 table-bg-gradient 
            shadow-lg shadow-primary-900/15">

                {/* Filters Section */}
                <div className="flex md:flex-row flex-col gap-5 items-center justify-between w-full">

                    {/* SearchField */}
                    <SearchField
                        placeholder="Search by Invoice Number"
                        value={searchValue}
                        onChange={setSearchValue}
                        onClear={() => {
                            setSearchValue("");
                            fetchInvoices(1);
                        }}
                        className="max-w-md w-full"
                    />

                    {/* Date Range Picker */}
                    <DateRangePicker
                        value={dateRange}
                        onChange={setDateRange}
                        className="max-w-[250px]"
                    />
                </div>

                {/* Data Table */}
                <DataTable
                    columns={columns}
                    data={invoices}
                    loading={loading}
                    pagination={{
                        page,
                        totalPages,
                        total,
                        onPageChange: (newPage) => {
                            setPage(newPage);
                            fetchInvoices(newPage);
                        },
                    }}
                />
            </div>

            {/* Invoice Dialog */}
            <DialogBox
                open={invoiceDialogOpen}
                onOpenChange={setInvoiceDialogOpen}
                title="Purchase Invoice"
                widthClass="md:min-w-3xl!"
            >
                {dialogLoading ? (
                    <div className="py-10 text-center text-white/70">Loading…</div>
                ) : (
                    selectedInvoice && (
                        <Invoice
                            type="purchase"
                            invoice={selectedInvoice}
                            items={selectedItems}
                        />
                    )
                )}
            </DialogBox>
        </div>
    );
};

export default PurchaseInvoicePage;
