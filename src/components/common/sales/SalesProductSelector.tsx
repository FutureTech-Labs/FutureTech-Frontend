"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { StatusBadge } from "../StatusBadge";
import { Button } from "@/components/ui/button";
import { formatCurrencyLKR } from "@/lib/utils";
import { useSalesCart } from "@/stores/useSalesCart";
import { getProducts } from "@/services/productService";
import ComboBoxField from "@/components/forms/ComboField";
import { ShoppingCart } from "lucide-react";

export default function SalesProductSelector() {
    const [selected, setSelected] = useState("");
    const [options, setOptions] = useState<Option[]>([]);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [featured, setFeatured] = useState<IProduct[]>([]);

    const addItem = useSalesCart((s) => s.addItem);

    // Fetch products ONCE
    useEffect(() => {
        (async () => {
            const res = await getProducts();

            // FILTER ONLY ACTIVE PRODUCTS
            const activeProducts = res.products.filter((p) => p.status === "active");

            setProducts(activeProducts);

            setOptions(
                activeProducts.map((p) => ({
                    value: p._id,
                    label: `${p.name} - (${p.totalStock})`,
                }))
            );

            // Generate 4 random active products only once
            const random = [...activeProducts]
                .sort(() => Math.random() - 0.5)
                .slice(0, 1);

            setFeatured(random);
        })();
    }, []);


    // Selected product
    const selectedProduct = products.find((p) => p._id === selected);

    return (
        <div className="flex flex-col gap-4 p-4 border-2 border-gradient border-primary-900/40 table-bg-gradient rounded-xl">
            <h2 className="text-xl font-semibold">Search Products</h2>

            {/* SEARCH DROPDOWN */}
            <ComboBoxField
                options={options}
                value={selected}
                onChange={setSelected}
                placeholder="Search products by name"
                className="search-gradient border-t-2 border-white/30! h-12 rounded-lg"
            />

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
                {(selectedProduct ? [selectedProduct] : featured).map((p) => (
                    <div
                        key={p._id}
                        className="flex flex-col p-3 sales-card-border-gradient rounded-xl overflow-hidden transition"
                    >
                        <div className="w-full h-30 bg-gray-800 flex items-center justify-center">
                            <Image
                                src={p.images?.[0].url}
                                alt={p.name}
                                width={500}
                                height={500}
                                placeholder="blur"
                                blurDataURL={p.images?.[0].url}
                                className="object-cover w-full h-full rounded-lg select-none pointer-events-none"
                            />

                        </div>

                        <div className="flex flex-col flex-1 gap-2 mt-2">
                            <h3 className="font-semibold text-sm line-clamp-2">{p.name}</h3>
                            <p className="text-xs text-gray-400">{p.category?.name}</p>

                            <div className="flex justify-between w-full items-center">

                                <p className="text-green-400 font-semibold mt-1">
                                    {formatCurrencyLKR(p.sellingPrice)}
                                </p>

                                <StatusBadge
                                    text={`${p.totalStock} Units`}
                                    color={p.totalStock > 10 ? "blue" : p.totalStock > 0 ? "yellow" : "red"}
                                />
                            </div>

                            <Button
                                onClick={() => addItem(p)}
                                className="main-button-gradient disabled:opacity-35"
                                disabled={p.totalStock <= 0}
                            >
                                Add to cart
                                <ShoppingCart className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
