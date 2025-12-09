"use client";

import { useEffect, useState } from "react";
import { getProductStock } from "@/services/stockService";
import { formatCurrencyLKR } from "@/lib/utils";
import { Loader2 } from "lucide-react";

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
        return <div className="text-center text-gray-400 py-6">No batch selected</div>;
    }

    return (
        <div className="flex flex-col gap-8 text-gray-200">

            {/* ================================
                BATCH INFORMATION
            ================================= */}
            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-white">Batch Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-black/20 border border-white/10">
                    <DetailRow label="Batch Code" value={batch.batchCode} />
                    <DetailRow label="Product" value={batch.product?.name ?? "—"} />
                    <DetailRow label="Supplier" value={batch.supplier?.name ?? "—"} />
                    <DetailRow label="Cost Price" value={formatCurrencyLKR(batch.costPrice)} />
                    <DetailRow label="Qty Received" value={batch.quantityReceived} />
                    <DetailRow label="Qty Available" value={batch.quantityAvailable} />
                    <DetailRow
                        label="Date Received"
                        value={new Date(batch.dateReceived).toLocaleDateString("en-GB")}
                    />
                </div>
            </section>

            {/* ================================
                PRODUCT STOCK OVERVIEW
            ================================= */}
            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-white">Product Stock Overview</h2>

                {loading ? (
                    <div className="flex justify-center py-6">
                        <Loader2 className="animate-spin text-white" />
                    </div>
                ) : productStock ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-black/20 border border-white/10">
                        <DetailRow label="Product Name" value={productStock.product.name} />
                        <DetailRow
                            label="Selling Price"
                            value={formatCurrencyLKR(productStock.product.sellingPrice)}
                        />
                        <DetailRow label="Total Stock" value={productStock.product.totalStock} />
                        <DetailRow label="Min Stock" value={batch.product?.minStock ?? "—"} />
                        <DetailRow
                            label="Status"
                            value={
                                productStock.product.totalStock === 0
                                    ? "Out of Stock"
                                    : productStock.product.totalStock <
                                        (batch.product?.minStock ?? 0)
                                        ? "Low Stock"
                                        : "Healthy"
                            }
                        />
                    </div>
                ) : (
                    <div className="text-gray-400">Unable to load product stock details.</div>
                )}
            </section>

            {/* ================================
                FIFO BATCH LIST FOR PRODUCT
            ================================= */}
            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-white">All Batches for This Product</h2>

                {loading ? (
                    <div className="flex justify-center py-6">
                        <Loader2 className="animate-spin text-white" />
                    </div>
                ) : productStock ? (
                    <div className="overflow-x-auto rounded-lg border border-white/10">
                        <table className="w-full text-sm">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <Th>Batch Code</Th>
                                    <Th>Cost Price</Th>
                                    <Th>Received</Th>
                                    <Th>Available</Th>
                                    <Th>Date</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {productStock.batches.map((b) => {
                                    const isCurrent = b._id === batch._id;
                                    return (
                                        <tr
                                            key={b._id}
                                            className={`${isCurrent
                                                ? "bg-primary-900/30"
                                                : "hover:bg-white/5"
                                                } border-b border-white/5`}
                                        >
                                            <Td>{b.batchCode}</Td>
                                            <Td>{formatCurrencyLKR(b.costPrice)}</Td>
                                            <Td>{b.quantityReceived}</Td>
                                            <Td>{b.quantityAvailable}</Td>
                                            <Td>
                                                {new Date(b.dateReceived).toLocaleDateString(
                                                    "en-GB"
                                                )}
                                            </Td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </section>
        </div>
    );
}

/* ---------------------------------------------
    Reusable Detail Row Component
---------------------------------------------- */
function DetailRow({ label, value }: { label: string; value: any }) {
    return (
        <div className="flex flex-col">
            <span className="text-xs text-gray-400">{label}</span>
            <span className="text-base font-medium text-white">{value}</span>
        </div>
    );
}

function Th({ children }: { children: React.ReactNode }) {
    return (
        <th className="text-left px-4 py-2 font-medium text-gray-300 uppercase text-xs tracking-wide">
            {children}
        </th>
    );
}

function Td({ children }: { children: React.ReactNode }) {
    return (
        <td className="px-4 py-2 text-gray-200 text-sm whitespace-nowrap">{children}</td>
    );
}
