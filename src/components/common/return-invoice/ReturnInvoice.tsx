"use client";

import Image from "next/image";
import { formatCurrencyLKR } from "@/lib/utils";
import { SimpleInvoiceTable } from "../InvoiceTable";
import { ColumnDef } from "@tanstack/react-table";

interface ReturnInvoiceProps {
    invoice: IReturn;
}

export default function ReturnInvoice({ invoice }: ReturnInvoiceProps) {
    const hasRefund = invoice.items?.some((item) => item.returnType === "refund");

    // ------------------------------------------
    // TABLE COLUMNS
    // ------------------------------------------

    // ---- Pick the real type ----
    type RItem = IReturnItem;

    // ---- Define columns ----
    const columns: ColumnDef<RItem>[] = [
        {
            header: "Product",
            accessorKey: "productName",
            cell: ({ row }) => row.original.productName,
        },
        {
            header: "Warranty",
            accessorKey: "warrantyPeriod",
            cell: ({ row }) => row.original.warrantyPeriod,
        },
        {
            header: "Qty",
            accessorKey: "quantity",
            cell: ({ row }) => row.original.quantity,
        },
        {
            header: "Reason",
            accessorKey: "reason",
            cell: ({ row }) => <span className="capitalize">{row.original.reason}</span>,
        },
        {
            header: "Type",
            accessorKey: "returnType",
            cell: ({ row }) => <span className="capitalize">{row.original.returnType}</span>,
        },
    ];

    if (hasRefund) {
        columns.push({
            header: "Refund",
            accessorKey: "refundAmount",
            cell: ({ row }) =>
                row.original.returnType === "refund"
                    ? formatCurrencyLKR(row.original.refundAmount ?? 0)
                    : "—",
        });
    }


    return (
        <div className="button-gradient rounded-xl p-6 border border-white/40">

            {/* --------------------------------------------------------- */}
            {/* HEADER */}
            {/* --------------------------------------------------------- */}
            <div className="flex flex-col justify-center gap-4 items-center p-6 rounded-lg button-gradient invoice-border-gradient">

                <div className="flex md:flex-row flex-col justify-between gap-4 items-start md:items-center w-full">

                    {/* LOGO */}
                    <div className="w-40 md:w-50">
                        <Image
                            src={"/images/LogoFull.png"}
                            alt="Logo"
                            width={500}
                            height={500}
                            priority
                            className="object-cover w-full h-full select-none"
                        />
                    </div>

                    {/* TITLE BLOCK */}
                    <div className="flex flex-col text-left">
                        <h1 className="font-bold text-xl md:text-3xl mb-2 text-primary-200">
                            RETURN INVOICE
                        </h1>

                        <InvoiceField
                            label="Return Invoice No:"
                            value={invoice.returnInvoiceNumber ?? "—"}
                        />

                        <InvoiceField
                            label="Return Date:"
                            value={
                                invoice.createdAt
                                    ? new Date(invoice.createdAt).toLocaleString()
                                    : "—"
                            }
                        />

                        <InvoiceField
                            label="Linked Sales Invoice:"
                            value={invoice.saleInvoice?.invoiceNumber ?? "—"}
                            accent
                        />

                        <InvoiceField
                            label="Status:"
                            value={invoice.status?.replace(/-/g, " ") ?? "—"}
                            accent
                        />
                    </div>
                </div>

                {/* CUSTOMER & RETURNED BY */}
                <div className="flex flex-col md:flex-row justify-between gap-5 items-start md:items-center w-full bg-black/20 rounded-lg p-5 invoice-border-gradient">

                    {/* CUSTOMER */}
                    <div className="flex flex-col gap-1.5 text-xs font-light">
                        <h3 className="opacity-80">Customer:</h3>
                        <h1 className="text-base font-medium">
                            {invoice.customer?.name ?? "—"}
                        </h1>
                        <h3>{invoice.customer?.email ?? "—"}</h3>
                        <h3>{invoice.customer?.contact ?? "—"}</h3>
                    </div>

                    {/* RETURNED BY */}
                    <div className="flex flex-col gap-1.5 text-xs font-light">
                        <h3 className="opacity-80">Processed By:</h3>
                        <h1 className="text-base font-medium">
                            {invoice.returnedBy?.name ?? "—"}
                        </h1>
                        <h3>{invoice.returnedBy?.email ?? "—"}</h3>
                    </div>
                </div>
            </div>

            {/* --------------------------------------------------------- */}
            {/* ITEMS TABLE */}
            {/* --------------------------------------------------------- */}
            <div className="flex flex-col gap-5 button-gradient p-6 mt-5 rounded-lg invoice-border-gradient">

                <SimpleInvoiceTable columns={columns} data={invoice.items ?? []} />

                {/* TOTAL REFUND (ONLY FOR REFUND CASES) */}
                {hasRefund && (
                    <div className="bg-white/5 border border-white/15 rounded-xl px-3 py-5 w-full flex flex-col gap-3 box-gradient max-w-sm ml-auto">
                        <div className="flex justify-between text-sm text-white/80">
                            <span>Total Refund:</span>
                            <span className="font-semibold text-primary-300">
                                {formatCurrencyLKR(invoice.refundTotal ?? 0)}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* --------------------------------------------------------- */}
            {/* FOOTER */}
            {/* --------------------------------------------------------- */}
            <div className="mt-6 -mx-6 -mb-6 px-6 py-4 bg-black/20 border-t border-white/20 text-center rounded-b-xl">
                <p className="flex flex-col gap-1 text-sm">
                    Return processed successfully.
                    <span className="font-light text-xs opacity-80">
                        Thank you for maintaining accurate return records.
                    </span>
                </p>
            </div>
        </div>
    );
}

function InvoiceField({
    label,
    value,
    accent = false,
}: {
    label: string;
    value: string | number;
    accent?: boolean;
}) {
    return (
        <p className="text-xs flex gap-2">
            <span className="opacity-80">{label}</span>
            <span
                className={accent ? "text-primary-300 font-semibold" : "text-white"}
            >
                {value}
            </span>
        </p>
    );
}
