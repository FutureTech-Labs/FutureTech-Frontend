"use client";

import { Button } from "@/components/ui/button";

type InvoiceData = IPurchaseInvoice | ISalesInvoice;
type InvoiceItem = IPurchaseInvoiceItem | ISalesInvoiceItem;

interface InvoiceProps {
    type: "purchase" | "sales";
    invoice: InvoiceData;
    items: InvoiceItem[];
}

export default function Invoice({ type, invoice, items }: InvoiceProps) {
    const isPurchase = type === "purchase";

    // Correctly typed parties
    const fromParty: IInvoiceParty | undefined =
        isPurchase ? (invoice as IPurchaseInvoice).supplier : { name: "FutureTech", id: "shop" };

    const toParty: IInvoiceParty | undefined =
        isPurchase
            ? { name: "FutureTech", id: "shop" }
            : (invoice as ISalesInvoice).customer;

    return (
        <div className="p-6 bg-zinc-900 text-gray-200 print:bg-white print:text-black">

            {/* HEADER */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Invoice #{invoice.invoiceNumber}</h1>
                    <p className="text-sm mt-1">
                        Date: {new Date(invoice.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                        Status: <span className="capitalize">{invoice.status}</span>
                    </p>
                </div>

                <Button
                    onClick={() => window.print()}
                    className="main-button-gradient print:hidden"
                >
                    Print
                </Button>
            </div>

            {/* FROM - TO */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <h3 className="font-semibold text-lg mb-1">From</h3>
                    <p>{fromParty?.name}</p>
                    {fromParty?.contact && <p>{fromParty.contact}</p>}
                    {fromParty?.email && <p>{fromParty.email}</p>}
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-1">To</h3>
                    <p>{toParty?.name}</p>
                    {toParty?.contact && <p>{toParty.contact}</p>}
                    {toParty?.email && <p>{toParty.email}</p>}
                </div>
            </div>

            {/* ITEMS TABLE */}
            <table className="w-full border border-gray-700 print:border-black">
                <thead className="bg-gray-800 print:bg-gray-200">
                    <tr>
                        <th className="p-2 text-left">Product</th>
                        <th className="p-2 text-center">Qty</th>

                        {isPurchase ? (
                            <th className="p-2 text-center">Cost Price</th>
                        ) : (
                            <th className="p-2 text-center">Selling Price</th>
                        )}

                        <th className="p-2 text-center">Total</th>

                        {isPurchase && (
                            <th className="p-2 text-center">Batch</th>
                        )}
                    </tr>
                </thead>

                <tbody>
                    {items.map((item) => (
                        <tr
                            key={item.id}
                            className="border-t border-gray-700 print:border-black"
                        >
                            <td className="p-2">{item.product?.name}</td>

                            <td className="p-2 text-center">{item.quantity}</td>

                            {/* Cost or Selling Price */}
                            <td className="p-2 text-center">
                                {isPurchase
                                    ? (item as IPurchaseInvoiceItem).costPrice
                                    : (item as ISalesInvoiceItem).sellingPrice}
                            </td>

                            <td className="p-2 text-center">{item.lineTotal}</td>

                            {/* Batch only for purchase */}
                            {isPurchase && (
                                <td className="p-2 text-center">
                                    {(item as IPurchaseInvoiceItem).batchCode}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* TOTAL */}
            <div className="mt-6 text-right">
                <p className="text-xl font-bold">
                    Total: LKR {invoice.totalAmount.toLocaleString()}
                </p>
            </div>
        </div>
    );
}
