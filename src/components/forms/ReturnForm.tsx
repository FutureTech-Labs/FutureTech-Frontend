"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import DataTable from "../common/Table";
import InputField from "../forms/InputField";
import SelectField from "../forms/SelectField";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { createReturn } from "@/services/returnServices";
import { computeWarrantyEndDate } from "@/lib/utils";

interface ReturnFormProps {
    invoice: ISalesInvoiceResponse;
    onClose: () => void;
    onSuccess: (createdReturn: IReturn) => void;
}

export default function ReturnForm({ invoice, onClose, onSuccess }: ReturnFormProps) {
    const { register, control, handleSubmit, setValue, watch } =
        useForm<ICreateReturnRequest>({
            defaultValues: {
                reason: "defective",
                returnType: "replacement",
                quantity: 0,
            },
        });

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const items = invoice.items;

    // ---------------------------------------------------
    // GLOBAL RETURN STATUS (for banners)
    // ---------------------------------------------------
    const totalReturned = items.reduce(
        (sum, it) => sum + (it.returnedQty ?? 0),
        0
    );

    const totalQty = items.reduce(
        (sum, it) => sum + it.quantity,
        0
    );

    const fullyReturned = totalReturned === totalQty;

    // ---------------------------------------------------
    // WARRANTY INFO
    // ---------------------------------------------------
    const warrantyInfo = (() => {
        if (selectedIndex === null) return null;

        const item = items[selectedIndex];
        if (!item) return null;

        const expiry = computeWarrantyEndDate(
            invoice.createdAt,
            item.warrantyPeriod
        );

        if (!expiry)
            return {
                expired: true,
                expiryDate: null,
            };

        const expired = new Date() > expiry;

        return {
            expired,
            expiryDate: expiry.toLocaleDateString("en-GB"),
        };
    })();

    // ---------------------------------------------------
    // TABLE COLUMNS
    // ---------------------------------------------------
    const columns = [
        {
            key: "productName",
            label: "Product Name",
            render: (row: IInvoiceItemResponse) => row.productName,
        },
        {
            key: "warranty",
            label: "Warranty",
            render: (row: IInvoiceItemResponse) =>
                row.warrantyPeriod || "no warranty",
        },
        {
            key: "qtyPurchased",
            label: "Purchased Qty",
            render: (row: IInvoiceItemResponse) => row.quantity,
        },
        {
            key: "returnedQty",
            label: "Returned",
            render: (row: IInvoiceItemResponse) => row.returnedQty ?? 0,
        },
        {
            key: "remainingQty",
            label: "Remaining",
            render: (row: IInvoiceItemResponse) =>
                row.quantity - (row.returnedQty ?? 0),
        },
        {
            key: "qtyToReturn",
            label: "Qty To Return",
            render: (row: IInvoiceItemResponse) => {
                const idx = items.indexOf(row);
                const remaining = row.quantity - (row.returnedQty ?? 0);

                if (remaining <= 0) {
                    return <span className="text-red-400 text-xs">No Qty Left</span>;
                }

                if (selectedIndex === idx) {
                    return (
                        <input
                            type="number"
                            min={1}
                            max={remaining}
                            {...register("quantity", {
                                required: "Quantity is required",
                                valueAsNumber: true,
                                max: {
                                    value: remaining,
                                    message: `Only ${remaining} qty left`,
                                },
                            })}
                            className="w-20 text-center bg-black-600 text-white rounded"
                        />
                    );
                }

                return "-";
            },
        },
        {
            key: "amount",
            label: "Amount",
            render: (row: IInvoiceItemResponse) =>
                `Rs. ${(row.sellingPrice * row.quantity).toLocaleString()}`,
        },
        {
            key: "action",
            label: "Action",
            render: (row: IInvoiceItemResponse) => {
                const idx = items.indexOf(row);

                const expiry = computeWarrantyEndDate(
                    invoice.createdAt,
                    row.warrantyPeriod
                );
                const disabledWarranty = !expiry || new Date() > expiry;

                const remaining = row.quantity - (row.returnedQty ?? 0);
                const disabledNoStock = remaining <= 0;

                const disabled = disabledWarranty || disabledNoStock || fullyReturned;

                return (
                    <Checkbox
                        checked={selectedIndex === idx}
                        disabled={disabled}
                        onCheckedChange={(checked) => {
                            if (!checked) {
                                setSelectedIndex(null);
                                setValue("quantity", 0);
                                return;
                            }

                            if (disabledWarranty) {
                                toast.error("Warranty expired. Cannot return this item.");
                                return;
                            }

                            if (disabledNoStock) {
                                toast.error("No quantity left to return.");
                                return;
                            }

                            if (fullyReturned) {
                                toast.error("This entire invoice is fully returned.");
                                return;
                            }

                            setSelectedIndex(idx);
                            setValue("quantity", 0);
                        }}
                        className="cursor-pointer bg-black-700 border-white/40"
                    />
                );
            },
        },
    ];

    // ---------------------------------------------------
    // SUBMIT HANDLER
    // ---------------------------------------------------
    const submitHandler = async (data: ICreateReturnRequest) => {
        if (fullyReturned) {
            toast.error("This invoice is fully returned.");
            return;
        }

        if (selectedIndex === null) {
            toast.error("Select a product");
            return;
        }

        const selectedItem = items[selectedIndex];

        if (!selectedItem._id) {
            toast.error("Sale item ID missing in invoice!");
            return;
        }

        const remaining =
            selectedItem.quantity - (selectedItem.returnedQty ?? 0);

        if (data.quantity > remaining) {
            toast.error(`Only ${remaining} quantity left to return`);
            return;
        }

        const expiry = computeWarrantyEndDate(
            invoice.createdAt,
            selectedItem.warrantyPeriod
        );

        const validWarranty = !!expiry && new Date() <= expiry;

        if (!validWarranty) {
            toast.error("Warranty expired. Cannot return this product.");
            return;
        }

        const payload: ICreateReturnRequest = {
            saleInvoiceId: invoice._id,
            itemId: selectedItem._id,
            quantity: data.quantity,
            reason: data.reason,
            returnType: data.returnType,
        };

        try {
            setLoading(true);
            const res: ICreateReturnResponse = await createReturn(payload);
            toast.success("Return processed");
            onSuccess?.(res.returnInvoice);
            onClose();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-6">

            {/* ----------------------------------------------- */}
            {/* RETURN STATUS BANNER */}
            {/* ----------------------------------------------- */}
            {totalReturned > 0 && (
                fullyReturned ? (
                    <div className="p-4 rounded-lg bg-red-900/40 border border-red-700 text-red-300 text-sm">
                        <p className="font-semibold text-red-200 mb-1">This invoice is fully returned.</p>
                        <p className="opacity-80">
                            All items have already been returned. No additional returns are allowed.
                        </p>
                    </div>
                ) : (
                    <div className="p-4 rounded-lg bg-yellow-900/40 border border-yellow-700 text-yellow-300 text-sm">
                        <p className="font-semibold text-yellow-200 mb-1">Invoice partially returned.</p>
                        <p className="opacity-80">
                            You may return only the remaining quantities.
                        </p>
                    </div>
                )
            )}

            {/* HEADER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    name="invoiceNumber"
                    label="Invoice"
                    value={invoice.invoiceNumber}
                    readonly
                    placeholder=""
                    register={register}
                />
                <InputField
                    name="invoiceDate"
                    label="Invoice Date"
                    value={new Date(invoice.createdAt).toLocaleDateString("en-GB")}
                    readonly
                    placeholder=""
                    register={register}
                />
            </div>

            {/* CUSTOMER */}
            <InputField
                name="customerName"
                label="Customer"
                value={invoice.customer.name}
                readonly
                placeholder=""
                register={register}
            />

            {/* WARRANTY BOX */}
            {selectedIndex !== null && warrantyInfo && (
                <div className="p-3 rounded-lg border border-white/20 bg-black-600 flex items-center justify-between">
                    <p className="text-sm text-gray-300">
                        <span className="font-semibold">Warranty Ends:</span>{" "}
                        {warrantyInfo.expiryDate ?? "No Warranty"}
                    </p>

                    <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${warrantyInfo.expired
                            ? "bg-red-700 text-white"
                            : "bg-green-700 text-white"
                            }`}
                    >
                        {warrantyInfo.expired ? "Warranty Expired" : "Valid Warranty"}
                    </span>
                </div>
            )}

            {/* TABLE */}
            <DataTable
                columns={columns}
                data={items}
                selectable={false}
                emptyMessage="No items"
                pagination={undefined}
            />

            {/* RETURN OPTIONS */}
            {!fullyReturned && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                        name="reason"
                        label="Reason"
                        value={watch("reason")}
                        control={control}
                        options={[
                            { value: "defective", label: "Defective" },
                            { value: "dead on arrival", label: "Dead on arrival" },
                            { value: "wrong item", label: "Wrong item" },
                            { value: "physical damage", label: "Physical damage" },
                            { value: "customer remorse", label: "Customer remorse" },
                            { value: "other", label: "Other" },
                        ]}
                    />

                    <SelectField
                        name="returnType"
                        label="Return Type"
                        value={watch("returnType")}
                        control={control}
                        options={[
                            { value: "replacement", label: "Replacement" },
                            { value: "refund", label: "Refund" },
                        ]}
                    />
                </div>
            )}

            {/* FOOTER */}
            <div className="sticky -bottom-px bg-black-500 flex gap-3 py-3 border-t border-gray-800">
                <Button
                    type="button"
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                    Cancel
                </Button>

                {!fullyReturned && (
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {loading ? "Saving..." : "Confirm Return"}
                    </Button>
                )}
            </div>
        </form>
    );
}
