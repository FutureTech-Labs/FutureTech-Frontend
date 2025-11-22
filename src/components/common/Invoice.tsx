"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { SimpleInvoiceTable } from "./InvoiceTable";
import { printInvoice } from "./invoice/PrintInvoice";
import { generateInvoicePDF } from "./invoice/InvoicePdf";
import { getWarrantyMessage } from "@/lib/warranty";
import { formatCurrencyLKR, formatReadableDate, toSentenceCase } from "@/lib/utils";

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


export default function Invoice({ type, invoice, items }: InvoiceProps) {
    const isPurchase = type === "purchase";

    const toParty: IInvoiceParty = isPurchase
        ? SHOP_DETAILS
        : {
            id: "customer",
            name: (invoice as ISalesInvoice).customer.name,
            email: (invoice as ISalesInvoice).customer.email || "",
            contact: (invoice as ISalesInvoice).customer.contact || "",
        };

    const fromParty: IInvoiceParty = isPurchase
        ? (invoice as IPurchaseInvoice).supplier
        : SHOP_DETAILS;

    const getInvoiceColumns = (isPurchase: boolean): ColumnDef<any>[] => {
        const baseColumns: ColumnDef<any>[] = [
            {
                accessorKey: "product.name",
                header: "Product Name",
                cell: ({ row }) => {
                    const item = row.original;
                    const isReturned = item.returned || (item.returnedQty ?? 0) > 0;

                    return (
                        <div className="flex items-center gap-2">
                            {/* Return dot */}
                            {isReturned && (
                                <span className="text-red-500 text-xs">●</span>
                            )}

                            {/* Product Name */}
                            <span className="block max-w-[150px] truncate">
                                {item.product?.name || "—"}
                            </span>
                        </div>
                    );
                },
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
                    ),
            },
        ];

        if (!isPurchase) {
            baseColumns.push({
                accessorKey: "discount",
                header: "Discount",
                cell: ({ row }) =>
                    row.original.discount
                        ? `- ${formatCurrencyLKR(row.original.discount)}`
                        : "—",
            });
        }

        baseColumns.push({
            accessorKey: "lineTotal",
            header: "Total",
            cell: ({ row }) => {
                const item = row.original;

                if (isPurchase) {
                    return formatCurrencyLKR(item.lineTotal);
                }

                const computed =
                    item.sellingPrice * item.quantity -
                    (item.discount || 0);

                return formatCurrencyLKR(computed);
            },
        });

        return baseColumns;
    };

    return (
        <div>
            <div className="button-gradient rounded-xl p-6 border border-white/50 max-w-4xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col justify-center gap-4 items-center p-6 rounded-lg button-gradient invoice-border-gradient">

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
                            <h1 className="font-bold text-xl md:text-3xl mb-1 md:mb-3">INVOICE</h1>

                            <InvoiceField label="Invoice number : " value={invoice.invoiceNumber} />

                            <InvoiceField
                                label="Issued date : "
                                value={
                                    isPurchase
                                        ? formatReadableDate((invoice as IPurchaseInvoice).date)
                                        : formatReadableDate((invoice as ISalesInvoice).createdAt)
                                }
                            />

                            <InvoiceField
                                label="Payment status : "
                                value={
                                    isPurchase
                                        ? toSentenceCase((invoice as IPurchaseInvoice).status)
                                        : toSentenceCase((invoice as ISalesInvoice).paymentStatus)
                                }
                                accent
                            />

                            {!isPurchase && (
                                <>
                                    <InvoiceField
                                        label="Issued by : "
                                        value={(invoice as ISalesInvoice).createdBy.name}
                                    />

                                    <InvoiceField
                                        label="Payment method : "
                                        value={toSentenceCase((invoice as ISalesInvoice).paymentMethod)}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* FROM / TO */}
                    <div className="flex flex-col md:flex-row justify-between gap-5 items-start md:items-center w-full bg-black/20 rounded-lg p-5 invoice-border-gradient">

                        <div className="flex flex-col gap-1.5 text-xs font-light">
                            <h3 className="opacity-80">From:</h3>
                            <h1 className="text-base font-medium">{fromParty.name}</h1>
                            <h3>{fromParty.email}</h3>
                            <h3>{fromParty.contact}</h3>
                        </div>

                        <div className={`flex flex-col gap-1.5 text-xs font-light ${isPurchase ? "w-[195px]" : "w-[200px]"}`}>
                            <h3 className="opacity-80">To:</h3>
                            <h1 className="text-base font-medium wrap-break-word">{toParty.name}</h1>
                            <h3>{toParty.email}</h3>
                            <h3>{toParty.contact}</h3>
                        </div>
                    </div>
                </div>

                {/* ITEMS TABLE */}
                <div className="flex flex-col gap-5 button-gradient p-6 mt-5 rounded-lg invoice-border-gradient">
                    <SimpleInvoiceTable data={items} columns={getInvoiceColumns(isPurchase)} />

                    {/* TOTALS */}
                    <div
                        className={`flex flex-col md:flex-row justify-between ${isPurchase ? "items-end" : "items-end"} gap-2.5`}
                    >

                        {/* UPDATED WARRANTY NOTICE — SALES ONLY */}
                        {!isPurchase && (
                            <div className="text-white/70 text-xs w-full">
                                <h3 className="font-normal text-white mb-1 underline underline-offset-3">
                                    Special Notice
                                </h3>

                                <div className="font-light text-xs leading-relaxed">
                                    {getWarrantyMessage(items).map((line, index) => (
                                        <p key={index}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* RIGHT TOTAL BOX */}
                        <div
                            className={`bg-white/5 border border-white/15 rounded-xl px-3 py-5 w-full flex flex-col gap-3 box-gradient 
                                ${isPurchase ? "w-sm ml-auto" : ""}`}
                        >
                            {!isPurchase && (
                                <div className="flex justify-between text-sm text-white/80">
                                    <span>Subtotal:</span>
                                    <span className="font-semibold text-white">
                                        {formatCurrencyLKR((invoice as ISalesInvoice).subtotal)}
                                    </span>
                                </div>
                            )}

                            {!isPurchase && (invoice as ISalesInvoice).discountTotal > 0 && (
                                <>
                                    <div className="flex justify-between text-sm text-white/80">
                                        <span>Discount:</span>
                                        <span className="font-semibold text-white">
                                            -{formatCurrencyLKR((invoice as ISalesInvoice).discountTotal)}
                                        </span>
                                    </div>

                                    <div className="w-full h-px bg-white/10 my-1" />
                                </>
                            )}

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-5">
                                <h1 className="text-sm text-nowrap text-primary-100">Grand Total:</h1>

                                <h2 className="text-xl md:text-2xl font-semibold text-primary-400">
                                    {isPurchase
                                        ? formatCurrencyLKR((invoice as IPurchaseInvoice).totalAmount)
                                        : formatCurrencyLKR((invoice as ISalesInvoice).total)}
                                </h2>
                            </div>
                        </div>
                    </div>

                </div>

                {/* FOOTER */}
                <div className="mt-6 -mx-6 -mb-6 px-6 py-4 bg-black/20 border-t border-white/20 text-center rounded-b-xl">
                    <p className="flex flex-col gap-1 text-sm">
                        Thank you for your business!
                        <span className="font-light text-xs">
                            For support, contact us at contact@futuretech.com or (+94) 76 853 8824
                        </span>
                    </p>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className={`sticky -bottom-px bg-black-500 flex gap-3 py-3 border-t border-gray-800`}>
                <Button
                    type="button"
                    onClick={() => generateInvoicePDF({ type, invoice, items })}
                    variant="outline"
                    className="flex-1 border border-blue-600! text-white hover:bg-gray-800 h-11"
                >
                    Download PDF
                </Button>

                <Button
                    type="button"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-11"
                    onClick={() => printInvoice({ type, invoice, items })}
                >
                    Print Invoice
                </Button>
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
    const accentColor =
        accent && String(value).toLowerCase() === "paid"
            ? "text-green-500"
            : accent
                ? "text-yellow-500"
                : "text-white";

    return (
        <p className="text-xs flex gap-2">
            <span className="opacity-80">{label}</span>
            <span className={`font-semibold ${accentColor}`}>{value}</span>
        </p>
    );
}
