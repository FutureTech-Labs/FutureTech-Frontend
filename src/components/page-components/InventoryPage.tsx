"use client";

import DataTable from "../common/Table";
import { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import ProductDetailsDialog from "../common/ProductDetailsDialog";

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
            render: (p: IProduct) => p.status || "—",
        },
        {
            key: "actions",
            label: "Actions",
            render: (p: IProduct) => (
                <div className="flex gap-2">
                    <button
                        className="px-2 py-1 bg-green-500 text-white rounded"
                        onClick={() => handleViewProduct(p)}
                    >
                        View
                    </button>

                    {role === "admin" && (
                        <>
                            <button className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                            <button className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Inventory</h1>
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

            {/* ✅ Reusable Dialog */}
            <ProductDetailsDialog
                product={selectedProduct}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </div>
    );
};

export default InventoryPage;
