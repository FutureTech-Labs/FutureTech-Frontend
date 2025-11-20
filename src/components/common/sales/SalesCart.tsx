"use client";

import { useSalesCart } from "@/stores/useSalesCart";
import { formatCurrencyLKR } from "@/lib/utils";

export default function SalesCart() {
    const { items, updateItem, updateDiscount, removeItem } = useSalesCart();

    const subtotal = items.reduce(
        (s, i) => s + i.product.sellingPrice * i.quantity,
        0
    );

    const discountTotal = items.reduce((s, i) => s + i.discount, 0);

    const total = subtotal - discountTotal;

    return (
        <div className="bg-gray-900/40 p-4 border border-gray-700 rounded-lg flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Cart</h2>

            {items.length === 0 && (
                <p className="text-gray-300 text-sm">No items added.</p>
            )}

            {items.map((item) => (
                <div
                    key={item.product._id}
                    className="flex items-center justify-between border-b border-gray-700 pb-2"
                >
                    <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm">
                            {formatCurrencyLKR(item.product.sellingPrice)}
                        </p>
                    </div>

                    <div className="flex gap-2 items-center">
                        <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                                updateItem(item.product._id, Number(e.target.value))
                            }
                            className="w-14 h-9 bg-black/30 border border-gray-700 rounded px-2"
                        />

                        <input
                            type="number"
                            min={0}
                            value={item.discount}
                            onChange={(e) =>
                                updateDiscount(item.product._id, Number(e.target.value))
                            }
                            className="w-20 h-9 bg-black/30 border border-gray-700 rounded px-2"
                            placeholder="Discount"
                        />

                        <button
                            onClick={() => removeItem(item.product._id)}
                            className="text-red-400 hover:text-red-600"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}

            {items.length > 0 && (
                <div className="pt-4 flex flex-col gap-1 text-sm text-gray-300">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrencyLKR(subtotal)}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Discount:</span>
                        <span>-{formatCurrencyLKR(discountTotal)}</span>
                    </div>

                    <div className="flex justify-between text-lg font-semibold text-white mt-2">
                        <span>Total:</span>
                        <span>{formatCurrencyLKR(total)}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
