"use client";

import { useEffect, useState } from "react";
import { getProductStock } from "@/services/stockService";
import { formatCurrencyLKR, formatDateTime } from "@/lib/utils";
import { Loader2, Package, AlertTriangle, CheckCircle } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { SimpleInvoiceTable } from "./InvoiceTable";

interface StockDetailsProps {
    batch: IStockBatch | null;
}

export default function StockDetails({ batch }: StockDetailsProps) {
    const [productStock, setProductStock] = useState<IProductStockResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!batch?.product?.id) return;
        setLoading(true);

        getProductStock(batch.product.id)
            .then((res) => setProductStock(res))
            .finally(() => setLoading(false));
    }, [batch]);

    if (!batch) {
        return (
            <div className="py-10 text-center text-gray-400">
                Select a batch to view details
            </div>
        );
    }

    // Status Logic
    const totalStock = productStock?.product.totalStock ?? 0;
    const minStock = batch.product?.minStock ?? 0;

    const status =
        totalStock === 0
            ? { text: "Out of Stock", color: "red", icon: <AlertTriangle size={14} /> }
            : totalStock < minStock
                ? { text: "Low Stock", color: "yellow", icon: <AlertTriangle size={14} /> }
                : { text: "Healthy", color: "green", icon: <CheckCircle size={14} /> };

    return (
        <div className="flex flex-col gap-8 text-gray-200">

            {/* PRODUCT HEADER */}
            <div className="flex items-center gap-4 p-5 bg-white/5 dashboard-card-border-gradient">
                <div className="w-12 h-12 rounded-lg bg-primary-900/30 flex items-center justify-center">
                    <Package className="text-primary-300 w-6 h-6" />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2 justify-between w-full">
                    <h1 className="text-lg md:text-2xl font-semibold">
                        {batch.product?.name}
                    </h1>

                    <StatusBadge
                        text={status.text}
                        color={status.color as any}
                        icon={status.icon}
                        className="text-xs"
                    />
                </div>
            </div>

            {/* BATCH INFORMATION */}
            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Batch Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white/5 p-5 dashboard-card-border-gradient">
                    <Detail label="Batch Code" value={batch.batchCode} />
                    <Detail label="Supplier" value={batch.supplier?.name ?? "—"} />
                    <Detail label="Cost Price" value={formatCurrencyLKR(batch.costPrice)} />
                    <Detail label="Date Received" value={formatDateTime(batch.dateReceived)} />
                    <Detail label="Quantity Received" value={batch.quantityReceived} />
                    <Detail label="Quantity Available" value={batch.quantityAvailable} />
                </div>
            </section>

            {/* PRODUCT STOCK OVERVIEW */}
            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Product Stock Overview</h2>

                {loading ? (
                    <LoaderBlock />
                ) : productStock ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white/5 p-5 dashboard-card-border-gradient">
                        <Detail label="Total Stock" value={productStock.product.totalStock} />
                        <Detail label="Min Stock" value={minStock} />
                        <Detail
                            label="Selling Price"
                            value={formatCurrencyLKR(productStock.product.sellingPrice)}
                        />

                        <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wide text-gray-400">
                                Stock Health
                            </span>
                            <StatusBadge
                                text={status.text}
                                color={status.color as any}
                                icon={status.icon}
                                className="text-xs"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-gray-400">Unable to load product stock details.</div>
                )}
            </section>

            {/* ========================
                FIFO BATCHES TABLE
            ========================= */}
            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">All Batches (FIFO)</h2>

                {loading ? (
                    <LoaderBlock />
                ) : productStock ? (
                    <SimpleInvoiceTable
                        columns={[
                            { header: "Batch Code", accessorKey: "batchCode" },
                            {
                                header: "Cost Price",
                                accessorKey: "costPrice",
                                cell: (row: any) => formatCurrencyLKR(row.getValue()),
                            },
                            { header: "Received", accessorKey: "quantityReceived" },
                            { header: "Available", accessorKey: "quantityAvailable" },
                            {
                                header: "Date",
                                accessorKey: "dateReceived",
                                cell: (row: any) => formatDateTime(row.getValue()),
                            },
                        ]}
                        data={productStock.batches}
                    />
                ) : null}
            </section>

            {/* FOOTER */}
            <div className="sticky -bottom-px flex flex-col md:flex-row gap-2 justify-between md:items-center py-4 border-t bg-black-500
            border-white/10 text-sm text-gray-400">
                {/* LEFT SIDE: PRODUCT META */}
                <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span>
                        Last Updated:{" "}
                        <span className="text-white font-medium">
                            {formatDateTime(batch.dateReceived)}
                        </span>
                    </span>
                </div>

                {/* RIGHT SIDE: IDENTIFIERS */}
                <div className="flex flex-col  md:flex-row items-center gap-3">
                    <span className="text-xs bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        Product ID: {batch.product?.id?.slice(-8) || "N/A"}
                    </span>

                    <span className="text-xs bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        Batch ID: {batch._id?.slice(-8)}
                    </span>
                </div>
            </div>

        </div>
    );
}

/* ---------------------------------------------
    REUSABLE COMPONENTS
---------------------------------------------- */

function Detail({ label, value }: { label: string; value: any }) {
    return (
        <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wide text-gray-400">
                {label}
            </span>
            <span className="text-base font-medium text-white">{value}</span>
        </div>
    );
}

function LoaderBlock() {
    return (
        <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-primary-300 w-7 h-7" />
        </div>
    );
}