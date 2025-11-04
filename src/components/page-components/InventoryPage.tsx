"use client";

import { useEffect, useState } from "react";

import DataTable from "../common/Table";
import { getProducts } from "@/services/productService";

const InventoryPage = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await getProducts();
                if (res.success) setProducts(res.products);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const columns = [
        { key: "name", label: "Product Name", render: (p: IProduct) => p?.name || "—" },
        { key: "brand", label: "Brand", render: (p: IProduct) => p.brand.name || "—" },
        { key: "category", label: "Category", render: (p: IProduct) => p.category?.name || "—" },
        { key: "price", label: "Price (Rs.)", render: (p: IProduct) => p.sellingPrice.toLocaleString() },
        { key: "status", label: "Status", render: (p: IProduct) => p.status || "—" },
    ];

    if (loading) return <p className="p-6">Loading...</p>;

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Inventory</h1>
            <DataTable columns={columns} data={products} />
        </div>
    );
};

export default InventoryPage;
