"use client";

import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

import {
    getAllSales,
    getMySales,
    getMySalesStats,
    getSaleById,
    getSalesStats,
} from "@/services/salesServices";

import {
    formatCurrencyLKR,
    formatDateTime,
    normalizeDateRange
} from "@/lib/utils";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "../ui/tooltip";

import {
    Banknote,
    ReceiptText,
    TrendingUp,
    RotateCcw
} from "lucide-react";

import StatCard from "../cards/StatCard";
import SearchField from "../forms/SearchField";
import SelectField from "../forms/SelectField";
import DataTable from "@/components/common/Table";
import Invoice from "@/components/common/Invoice";
import DialogBox from "@/components/common/DialogBox";
import IconButton from "@/components/common/IconButton";
import PaginationSlider from "../sliders/PaginationSlider";
import { DateRangePicker } from "@/components/common/DateRangePicker";

interface SalesInvoicesPageProps {
    role: "admin" | "cashier" | null;
}

export default function SalesInvoicesPage({ role }: SalesInvoicesPageProps) {
    const [invoices, setInvoices] = useState<ISalesInvoiceResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [to, setTo] = useState("");
    const [from, setFrom] = useState("");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [searchValue, setSearchValue] = useState("");

    const [dialogLoading, setDialogLoading] = useState(false);
    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<ISalesInvoiceResponse | null>(null);

    const [roleFilter, setRoleFilter] = useState<"cashier" | "admin" | "all">("all");

    // STAT CARDS
    const [stats, setStats] = useState({
        totalSales: 0,
        totalInvoices: 0,
        avgInvoice: 0,
        returnedInvoices: 0
    });


    // Sync date range
    useEffect(() => {
        const { from, to } = normalizeDateRange(dateRange);
        setFrom(from);
        setTo(to);
        setPage(1);
    }, [dateRange]);

    // Fetch invoices
    const fetchInvoices = async (selectedPage = 1) => {
        try {
            setLoading(true);
            const params: any = { page: selectedPage };

            if (from) params.from = from;
            if (to) params.to = to;
            if (searchValue) params.invoiceNumber = searchValue;
            if (role === "admin" && roleFilter !== "all") {
                params.role = roleFilter;
            }

            const res = role === "admin" ? await getAllSales(params) : await getMySales(params);
            setInvoices(res.data);
            setTotal(res.meta.total);
            setTotalPages(Math.ceil(res.meta.total / res.meta.limit));
        } catch (err) {
            console.error("Failed to fetch invoices", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = role === "admin"
                ? await getSalesStats()
                : await getMySalesStats();

            if (res?.success) {
                setStats(res.stats);
            }
        } catch (err) {
            console.error("Failed to fetch stats", err);
        }
    };

    // Run when date range changes
    useEffect(() => {
        setPage(1);
        fetchInvoices(1);
    }, [from, to]);

    useEffect(() => {
        fetchStats();
    }, []);

    // Auto-search by invoice number
    useEffect(() => {
        setPage(1);
        fetchInvoices(1);
    }, [searchValue]);

    // Run when role filter changes
    useEffect(() => {
        setPage(1);
        fetchInvoices(1);
    }, [roleFilter]);


    // Open specific invoice
    const openInvoice = async (invoiceId: string) => {
        try {
            setDialogLoading(true);
            const res = await getSaleById(invoiceId);
            setSelectedInvoice(res.invoice);
            setInvoiceDialogOpen(true);
        } catch {
            console.error("Invoice load failed");
        } finally {
            setDialogLoading(false);
        }
    };

    // Table Columns
    const columns = [
        {
            key: "invoiceNumber",
            label: "Invoice ID",
            render: (row: ISalesInvoiceResponse) => row.invoiceNumber,
        },
        {
            key: "customer",
            label: "Customer",
            render: (row: ISalesInvoiceResponse) => row.customer?.name ?? "—",
        },
        {
            key: "total",
            label: "Amount",
            render: (row: ISalesInvoiceResponse) =>
                formatCurrencyLKR(row.total)
        },
        {
            key: "createdBy",
            label: "Sold By",
            render: (row: ISalesInvoiceResponse) => (
                <span>
                    {row.createdBy.name}
                    {row.createdBy.role === 'admin' && (
                        <span className="ml-1 text-yellow-400 text-xs">(ADMIN)</span>
                    )}

                </span>
            )
        },
        {
            key: "createdAt",
            label: "Date",
            render: (row: ISalesInvoiceResponse) => formatDateTime(row.createdAt)
        },
        {
            key: "returnStatus",
            label: "Return",
            render: (row: ISalesInvoiceResponse) => {
                const totalReturned = row.items.reduce(
                    (sum, it) => sum + (it.returnedQty ?? 0),
                    0
                );

                const totalQty = row.items.reduce(
                    (sum, it) => sum + it.quantity,
                    0
                );

                let color = "text-green-500";
                let message = "No returned items";

                if (totalReturned > 0 && totalReturned < totalQty) {
                    color = "text-yellow-400";
                    message = `${totalReturned} of ${totalQty} items returned`;
                }

                if (totalReturned === totalQty) {
                    color = "text-red-500";
                    message = "Fully returned";
                }

                return (
                    <Tooltip>
                        <TooltipTrigger>
                            <span className={`${color} text-xl cursor-default`}>●</span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{message}</p>
                        </TooltipContent>
                    </Tooltip>
                );
            },
        },

        {
            key: "actions",
            label: "Actions",
            render: (row: ISalesInvoiceResponse) => (
                <IconButton
                    iconSrc="/icons/Eye.svg"
                    ariaLabel="view"
                    onClick={() => openInvoice(row._id)}
                />
            ),
        },
    ];

    // Stat Cards
    const invoiceStatCards = [
        <StatCard
            key="total-sales"
            title="Total Sales Amount"
            value={formatCurrencyLKR(stats.totalSales)}
            icon={<Banknote className="w-5 h-5 text-green-400" />}
            iconBg="bg-green-500/10"
            gradient="linear-gradient(79.74deg, rgba(0,255,132,0.15) 0%, rgba(0,0,0,0.12) 100%)"
        />,

        <StatCard
            key="total-invoices"
            title="Total Invoices"
            value={stats.totalInvoices}
            icon={<ReceiptText className="w-5 h-5 text-blue-400" />}
            iconBg="bg-blue-500/10"
            gradient="linear-gradient(79.74deg, rgba(0,128,255,0.15) 0%, rgba(0,0,0,0.12) 100%)"
        />,

        <StatCard
            key="avg-invoice"
            title="Average Invoice"
            value={formatCurrencyLKR(stats.avgInvoice)}
            icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
            iconBg="bg-purple-500/10"
            gradient="linear-gradient(79.74deg, rgba(180,0,255,0.15) 0%, rgba(0,0,0,0.12) 100%)"
        />,

        <StatCard
            key="returned-invoices"
            title="Returned Invoices"
            value={stats.returnedInvoices}
            icon={<RotateCcw className="w-5 h-5 text-red-400" />}
            iconBg="bg-red-500/10"
            gradient="linear-gradient(79.74deg, rgba(255,0,0,0.15) 0%, rgba(0,0,0,0.12) 100%)"
        />
    ];

    return (
        <div className="flex flex-col gap-6">

            {/* Desktop grid */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
                {invoiceStatCards}
            </div>

            {/* Mobile slider */}
            <PaginationSlider>{invoiceStatCards}</PaginationSlider>

            <div className="flex flex-col gap-6 p-5 rounded-xl border-2 border-gradient border-primary-900/40 table-bg-gradient 
            shadow-lg shadow-primary-900/15">

                {/* Filters */}
                <div className="flex md:flex-row flex-col gap-5 items-center justify-between w-full">

                    <SearchField
                        placeholder="Search by Invoice Number"
                        value={searchValue}
                        onChange={setSearchValue}
                        onClear={() => {
                            setSearchValue("");
                            fetchInvoices(1);
                        }}
                        className="max-w-sm w-full"
                    />

                    <div className="flex flex-col md:flex-row gap-4 w-full items-center justify-end">

                        {role === 'admin' && (
                            <SelectField
                                placeholder="Select Role"
                                value={roleFilter}
                                onChange={(val) => {
                                    setRoleFilter(val as "all" | "cashier" | "admin");
                                }}
                                options={[
                                    { label: "All", value: "all" },
                                    { label: "Sales by Cashiers", value: "cashier" },
                                    { label: "Sales by Admin", value: "admin" },
                                ]}
                                width="md:max-w-[180px] search-gradient"
                            />
                        )}

                        <DateRangePicker
                            value={dateRange}
                            onChange={setDateRange}
                            className="max-w-[250px]"
                        />
                    </div>
                </div>

                {/* Table */}
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
                title="Sales Invoice"
                widthClass="md:min-w-4xl!"
            >
                {dialogLoading ? (
                    <div className="py-10 text-center text-white/70">Loading…</div>
                ) : (
                    selectedInvoice && (
                        <Invoice
                            type="sales"
                            invoice={selectedInvoice}
                            items={selectedInvoice.items}
                        />
                    )
                )}
            </DialogBox>
        </div>
    );
}
