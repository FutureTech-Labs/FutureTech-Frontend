"use client";

import { useEffect, useState } from "react";

import { getProducts } from "@/services/productService";
import { useSalesCart } from "@/stores/useSalesCart";
import ComboBoxField from "@/components/forms/ComboField";

export default function SalesProductSelector() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [options, setOptions] = useState<Option[]>([]);
    const [selected, setSelected] = useState("");
    const addItem = useSalesCart((s) => s.addItem);

    useEffect(() => {
        (async () => {
            const res = await getProducts();
            setProducts(res.products);
            setOptions(
                res.products.map((p) => ({
                    value: p._id,
                    label: `${p.name} (${p.totalStock})`,
                }))
            );
        })();
    }, []);

    const selectedProduct = products.find((p) => p._id === selected);

    return (
        <div className="flex flex-col gap-4 p-4 bg-gray-900/40 rounded-lg border border-gray-700">
            <ComboBoxField
                label="Search Product"
                options={options}
                value={selected}
                onChange={setSelected}
                placeholder="Search by product name"
            />

            {selectedProduct && (
                <div className="p-3 rounded-lg bg-black/20 border border-gray-700 flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold">{selectedProduct.name}</h2>
                        <p className="text-sm text-gray-300">
                            {selectedProduct.totalStock} items available
                        </p>
                    </div>

                    <button
                        onClick={() => addItem(selectedProduct)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Add to Cart
                    </button>
                </div>
            )}
        </div>
    );
}
