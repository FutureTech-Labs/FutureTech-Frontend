"use client";

import { useSalesCart } from "@/stores/useSalesCart";
import { formatCurrencyLKR } from "@/lib/utils";
import { ShoppingCart, Trash2 } from "lucide-react";

export default function SalesCart() {
    const { items, updateItem, updateDiscount, removeItem } = useSalesCart();

    const subtotal = items.reduce((s, i) => s + i.product.sellingPrice * i.quantity, 0);
    const discountTotal = items.reduce((s, i) => s + i.discount, 0);
    const total = subtotal - discountTotal;

    return (
        <div className="flex flex-col gap-4 p-4 border-2 border-gradient border-primary-900/40 table-bg-gradient rounded-xl h-full overflow-hidden">
            {items.length !== 0 && (
                <h2 className="text-xl font-semibold mb-2">Cart</h2>
            )}

            {/* Header Row */}
            {items.length > 0 && (
                <div className="flex justify-between text-[1rem] text-primary-100">
                    <span className="w-1/2">Item</span>
                    <span className="w-1/5 text-left">Qty</span>
                    <span className="w-1/4 text-left mr-4">Discount</span>
                </div>
            )}

            {/* Empty State */}
            {items.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-1 h-full">
                    <div className="p-4 bg-gray-800/40 rounded-full border border-gray-700">
                        <ShoppingCart className="h-10 w-10" />
                    </div>
                    <p className="text-sm mt-1">Cart is empty</p>
                    <p className="text-xs text-gray-500">Start adding items to process a sale</p>
                </div>
            )}

            {/* CART ITEMS */}
            <div className="flex flex-col gap-4">
                {items.map((item) => (
                    <div
                        key={item.product._id}
                        className="flex items-center justify-between border border-white/60 rounded-lg p-3"
                    >
                        {/* PRODUCT DETAILS */}
                        <div className="flex items-center gap-3 w-1/2">
                            <div className="flex flex-col gap-1">
                                <p className="font-semibold text-[16px]">{item.product.name}</p>
                                <p className="text-xs text-gray-400">
                                    {formatCurrencyLKR(item.product.sellingPrice)}
                                </p>
                            </div>
                        </div>

                        {/* QTY FIELD */}
                        <div className="w-1/4 flex justify-center">
                            <input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) =>
                                    updateItem(item.product._id, Number(e.target.value))
                                }
                                className="w-20 h-11 bg-transparent border border-white/45 rounded-md text-center text-sm"
                            />
                        </div>

                        {/* DISCOUNT FIELD */}
                        <div className="w-1/3 flex justify-center">
                            <input
                                type="number"
                                min={0}
                                placeholder="-"
                                value={item.discount || ""}
                                onChange={(e) =>
                                    updateDiscount(item.product._id, Number(e.target.value || 0))
                                }
                                className="w-20 h-11 bg-transparent border border-white/45 rounded-md text-center text-sm"
                            />
                        </div>

                        {/* DELETE BUTTON */}
                        <button
                            onClick={() => removeItem(item.product._id)}
                            className="text-red-400 hover:text-red-600 ml-2"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}

                {items.length > 0 && (
                    <div className="pt-4 flex flex-col justify-end h-full gap-1 text-sm text-gray-300">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>{formatCurrencyLKR(subtotal)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Discount:</span>
                            <span className="text-pink-100"> - {formatCurrencyLKR(discountTotal)}</span>
                        </div>

                        <div className="flex justify-between text-lg font-semibold text-white mt-2">
                            <span>Total:</span>
                            <span className="border-t border-white/40 text-green-300">{formatCurrencyLKR(total)}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
