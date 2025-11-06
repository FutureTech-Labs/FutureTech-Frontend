"use client";

import DataTable from "../common/Table";
import { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import ProductDetailsDialog from "../common/ProductDetailsDialog";
import { ScrollableTabs } from "../common/ScrollableTabs";
import { cn, toSentenceCase } from "@/lib/utils";
import IconButton from "../common/IconButton";
import { Eye } from "lucide-react";

interface InventoryPageProps {
    role: "admin" | "cashier" | null;
}

const InventoryPage = ({ role }: InventoryPageProps) => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await getProducts({ page });
                if (res.success) {
                    setProducts(res.products);
                    setTotalPages(res.totalPages);
                    setTotal(res.total);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page]);

    const handleViewProduct = (product: IProduct) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    const columns = [
        {
            key: "date",
            label: "Date",
            render: (p: IProduct) => new Date(p.createdAt).toLocaleDateString("en-GB") || "—",
        },
        {
            key: "name",
            label: "Product",
            render: (p: IProduct) => p.name || "—",
        },
        {
            key: "image",
            label: "Image",
            render: (p: IProduct) =>
                p.images?.[0] ? (
                    <img
                        src={p.images[0]}
                        alt={p.name}
                        width={50}
                        height={50}
                        className="object-contain rounded"
                    />
                ) : (
                    "—"
                ),
        },
        {
            key: "price",
            label: "Selling Price (Rs.)",
            render: (p: IProduct) => p.sellingPrice.toLocaleString() || "—",
        },
        {
            key: "status",
            label: "Status",
            render: (p: IProduct) => (
                <span
                    className={cn(
                        "px-3 py-1 text-sm font-medium rounded-full border transition-colors duration-200",
                        p.status === "active"
                            ? "bg-green-500/15 text-green-500 border-green-500/30"
                            : "bg-zinc-700/20 text-zinc-400 border-zinc-500/30"
                    )}
                >
                    {toSentenceCase(p.status)}
                </span>
            ),
        },

        {
            key: "actions",
            label: "Actions",
            render: (p: IProduct) => (
                <div className="flex">
                    <IconButton
                        iconSrc="/icons/Eye.svg"
                        ariaLabel="view"
                        onClick={() => handleViewProduct(p)}
                    />

                    {role === "admin" && (
                        <>
                            <IconButton
                                iconSrc="/icons/Edit.svg"
                                ariaLabel="Edit"
                            />
                            <IconButton
                                iconSrc="/icons/Delete.svg"
                                ariaLabel="Delete"
                            />
                        </>
                    )}
                </div>
            ),
        },
    ];

    const tabs = Array.from({ length: 15 }).map((_, i) => ({
        value: `tab${i + 1}`,
        label: `All products ${i + 1}`,
    }))

    return (
        <div className=" p-5 rounded-xl border-2 border-primary-900/40 table-bg-gradient shadow-lg shadow-primary-900/15">
            <div className="w-full mb-5">
                <ScrollableTabs tabs={tabs} />
            </div>

            <DataTable
                columns={columns}
                data={products}
                loading={loading}
                pagination={{
                    page,
                    totalPages,
                    total,
                    onPageChange: (newPage) => setPage(newPage),
                }}
            />

            <ProductDetailsDialog
                product={selectedProduct}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </div>
    );
};

export default InventoryPage;
