"use client";

import Image from "next/image";
import { useState } from "react";
import DialogBox from "./DialogBox";
import { Button } from "@/components/ui/button";
import { formatCurrencyLKR } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { generateInvoicePDF } from "./invoice/InvoicePdf";
import { SimpleInvoiceTable } from "./InvoiceTable";
import { printInvoice } from "./invoice/PrintInvoice";
import { formatReadableDate, toSentenceCase } from "@/lib/utils";

type InvoiceData = IPurchaseInvoice | ISalesInvoice;
type InvoiceItem = IPurchaseInvoiceItem | ISalesInvoiceItem;

interface InvoiceProps {
    type: "purchase" | "sales";
    invoice: InvoiceData;
    items: InvoiceItem[];
}

const SHOP_DETAILS: IInvoiceParty = {
    id: "Shop_Details",
    name: "FutureTech Pvt Ltd.",
    email: "contact@futuretech.com",
    contact: "+94 76 853 8824",
};


export default function TestInvoice({ type, invoice, items }: InvoiceProps) {
    const [viewDialogOpen, setviewDialogOpen] = useState(false);
    const isPurchase = type === "purchase";

    const fromParty: IInvoiceParty = isPurchase ? (invoice as IPurchaseInvoice).supplier : SHOP_DETAILS;

    const toParty: IInvoiceParty = isPurchase ? SHOP_DETAILS : (invoice as ISalesInvoice).customer;

    const getInvoiceColumns = (isPurchase: boolean): ColumnDef<any>[] => [
        {
            accessorKey: "product.name",
            header: "Product Name",
            cell: ({ row }) => row.original.product?.name || "—",
        },
        {
            accessorKey: "quantity",
            header: "Qty",
            cell: ({ row }) => row.original.quantity,
        },
        {
            accessorKey: isPurchase ? "costPrice" : "sellingPrice",
            header: isPurchase ? "Cost Price" : "Selling Price",
            cell: ({ row }) =>
                formatCurrencyLKR(
                    isPurchase
                        ? row.original.costPrice
                        : row.original.sellingPrice
                )
        },
        {
            accessorKey: "lineTotal",
            header: "Total",
            cell: ({ row }) => formatCurrencyLKR(row.original.lineTotal),
        },
    ];

    return (
        <div className="flex flex-col max-w-xs">
            <Button
                onClick={() => {
                    setviewDialogOpen(true);
                }}
            >
                Click me
            </Button>

            <DialogBox
                open={viewDialogOpen}
                onOpenChange={setviewDialogOpen}
                title="Invoice Preview"
                widthClass="max-w-3xl"
            >
                <div className="button-gradient rounded-xl p-6 border border-white/50">

                    {/* HEADER */}
                    <div className="flex flex-col justify-center gap-4 items-center p-6 rounded-lg button-gradient invoice-border-gradient">

                        {/* Logo and Invoice details */}
                        <div className="flex md:flex-row flex-col justify-between gap-4 items-start md:items-center w-full">
                            <div className="w-40 md:w-50">
                                <Image
                                    src={"/images/LogoFull.png"}
                                    alt="Logo"
                                    width={500}
                                    height={500}
                                    priority
                                    className="object-cover w-full h-full select-none z-10"
                                />
                            </div>
                            <div className="flex flex-col text-left">
                                <h1 className="font-bold text-xl md:text-3xl mb-1  md:mb-3">
                                    INVOICE
                                </h1>
                                <InvoiceField label="Invoice number : " value={invoice.invoiceNumber} />
                                <InvoiceField label="Issued date : " value={formatReadableDate(invoice.date)} />
                                <InvoiceField label="Payment status : " value={toSentenceCase(invoice.status)} accent />
                            </div>
                        </div>

                        {/* Divider area (Bill To + Payment Info container layout) */}
                        <div className="flex flex-col md:flex-row justify-between gap-5 items-start md:items-center w-full bg-black/20 rounded-lg p-5 invoice-border-gradient">

                            <div className="flex flex-col gap-1.5 text-xs font-light">
                                <h3 className="opacity-80">From:</h3>
                                <h1 className="text-base font-medium">{fromParty?.name}</h1>
                                <h3>{fromParty.email}</h3>
                                <h3>{fromParty.contact}</h3>
                            </div>

                            <div className="flex flex-col gap-1.5 text-xs font-light w-[170px]">
                                <h3 className="opacity-80">To:</h3>
                                <h1 className="text-base font-medium wrap-break-word">{toParty?.name}</h1>
                                <h3>{toParty.email}</h3>
                                <h3>{toParty.contact}</h3>
                            </div>
                        </div>
                    </div>

                    {/* ITEMS TABLE */}
                    <div className="flex flex-col gap-5 button-gradient p-6 mt-5 rounded-lg invoice-border-gradient">
                        <SimpleInvoiceTable
                            data={items}
                            columns={getInvoiceColumns(isPurchase)}
                        />

                        {/* FOOTER SECTION - NOTICE + TOTALS */}
                        <div className="flex flex-col md:flex-row justify-between gap-5">

                            {/* LEFT — SPECIAL NOTICE */}
                            <div className="text-white/70 text-xs max-w-xs">
                                <h3 className="font-normal text-white mb-1 underline underline-offset-3">Special Notice</h3>
                                <p className="font-light text-xs leading-relaxed">
                                    Warranty claims may take up to 60 days. If unavailable, the purchase amount will be refunded. Products once sold are non-refundable. See overleaf for full Terms & Conditions.
                                </p>
                            </div>

                            {/* RIGHT — TOTALS BOX */}
                            <div className="bg-white/5 border border-white/15 rounded-xl px-3 py-5 w-full flex flex-col gap-3 box-gradient">

                                {/* Subtotal (ONLY FOR SALES) */}
                                {!isPurchase && (
                                    <div className="flex justify-between text-sm text-white/80">
                                        <span>Subtotal:</span>
                                        <span className="font-semibold text-white">
                                            {formatCurrencyLKR((invoice as ISalesInvoice).subtotal)}
                                        </span>
                                    </div>
                                )}

                                {/* Discount (ONLY FOR SALES & IF > 0) */}
                                {!isPurchase && (invoice as ISalesInvoice).discount > 0 && (
                                    <>
                                        <div className="flex justify-between text-sm text-white/80">
                                            <span>Discount ({(invoice as ISalesInvoice).discount}%)</span>
                                            <span className="font-semibold text-white">
                                                -{formatCurrencyLKR(((invoice as ISalesInvoice).subtotal *
                                                    (invoice as ISalesInvoice).discount) / 100)}
                                            </span>
                                        </div>

                                        {/* Divider Line */}
                                        <div className="w-full h-px bg-white/10 my-1" />
                                    </>
                                )}

                                {/* GRAND TOTAL (ALWAYS SHOWN) */}
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-5">
                                    <h1 className="text-sm text-nowrap text-primary-100">Grand Total:</h1>

                                    <h2 className="text-xl md:text-2xl font-semibold text-primary-400">
                                        {isPurchase
                                            ? formatCurrencyLKR(invoice.totalAmount)
                                            : formatCurrencyLKR((invoice as ISalesInvoice).totalAmount)
                                        }
                                    </h2>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Invoice footer */}
                    <div className="mt-6 -mx-6 -mb-6 px-6 py-4 bg-black/20 border-t border-white/20 text-center rounded-b-xl">
                        <p className="flex flex-col gap-1 text-sm">
                            Thank you for your business!
                            <span className="font-light text-xs"> For support, contact us at contact@futuretech.com or (+94) 76 853 8824</span>
                        </p>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-black-500 flex gap-3 py-3 border-t border-gray-800">
                    <Button
                        type="button"
                        onClick={() => {
                            generateInvoicePDF({
                                type,
                                invoice,
                                items
                            });
                        }}
                        variant="outline"
                        className="flex-1 border border-blue-600! text-primary-500 hover:bg-gray-800"
                    >
                        Download PDF
                    </Button>
                    <Button
                        type="button"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => printInvoice({ type, invoice, items })}>

                        Print Invoice
                    </Button>
                </div>
            </DialogBox>
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
    const accentColor =
        accent && String(value).toLowerCase() === "paid"
            ? "text-green-500"
            : accent
                ? "text-yellow-500"
                : "text-white";

    return (
        <p className="text-xs flex gap-2">
            <span className="opacity-80">{label}</span>
            <span className={`font-semibold ${accentColor}`}>
                {value}
            </span>
        </p>
    );
}



{/* <Button
    onClick={() => window.print()}
    className="main-button-gradient print:hidden"
>
    Print
</Button> */}