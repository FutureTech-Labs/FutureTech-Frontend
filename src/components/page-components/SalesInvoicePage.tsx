"use client";

import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

import SearchField from "../forms/SearchField";
import DataTable from "@/components/common/Table";
import Invoice from "@/components/common/Invoice";
import DialogBox from "@/components/common/DialogBox";
import IconButton from "@/components/common/IconButton";

import { DateRangePicker } from "@/components/common/DateRangePicker";

import {
    getAllSales,
    getMySales,
    getSaleById,
} from "@/services/salesServices";

import { formatCurrencyLKR, formatLocalDate } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface SalesInvoicesPageProps {
    role: "admin" | "cashier" | null;
}

export default function SalesInvoicesPage({ role }: SalesInvoicesPageProps) {
    const [invoices, setInvoices] = useState<ISalesInvoiceResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [searchValue, setSearchValue] = useState("");

    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<ISalesInvoiceResponse | null>(null);

    // Sync date range
    useEffect(() => {
        setFrom(formatLocalDate(dateRange?.from));
        setTo(formatLocalDate(dateRange?.to));
    }, [dateRange]);

    // Fetch invoices
    const fetchInvoices = async (selectedPage = 1) => {
        try {
            setLoading(true);
            const params: any = { page: selectedPage };

            if (from) params.from = from;
            if (to) params.to = to;
            if (searchValue) params.invoiceNumber = searchValue;

            const res =
                role === "admin"
                    ? await getAllSales(params)
                    : await getMySales(params);

            setInvoices(res.data);
            setTotal(res.meta.total);
            setTotalPages(Math.ceil(res.meta.total / res.meta.limit));
        } catch (err) {
            console.error("Failed to fetch invoices", err);
        } finally {
            setLoading(false);
        }
    };

    // Run when date range changes
    useEffect(() => {
        fetchInvoices(1);
    }, [from, to]);

    // Auto-search by invoice number
    useEffect(() => {
        fetchInvoices(1);
    }, [searchValue]);

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
                formatCurrencyLKR(row.total),
        },
        {
            key: "createdBy",
            label: "Created By",
            render: (row: ISalesInvoiceResponse) => row.createdBy.name ?? "—",
        },
        {
            key: "createdAt",
            label: "Date",
            render: (row: ISalesInvoiceResponse) =>
                new Date(row.createdAt).toLocaleString(),
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

    return (
        <div className="flex flex-col gap-6">

            <div className="flex flex-col gap-6 p-5 rounded-xl border-2 border-gradient border-primary-900/40 table-bg-gradient shadow-lg shadow-primary-900/15">

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
                        className="max-w-md w-full"
                    />

                    <DateRangePicker
                        value={dateRange}
                        onChange={setDateRange}
                        className="max-w-[250px]"
                    />
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
