"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import InputField from "./InputField";
import SelectField from "./SelectField";
import { toast } from "sonner";
import { formatCurrencyLKR } from "@/lib/utils";

import { createSupplierPayment } from "@/services/supplierPayments";
import { getSupplierById } from "@/services/supplierServices";
import TextareaField from "./TextAreaField";

interface PaySupplierFormProps {
    supplier: ISupplier | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function PaySupplierForm({
    supplier,
    onSuccess,
    onCancel,
}: PaySupplierFormProps) {
    const [loading, setLoading] = useState(false);
    const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);
    const [freshSupplier, setFreshSupplier] = useState<ISupplier | null>(supplier);

    const {
        handleSubmit,
        register,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            amount: "",
            paymentMethod: "cash",
            notes: "",
        },
    });

    // Fetch fresh supplier updates
    useEffect(() => {
        if (!supplier?._id) return;

        (async () => {
            try {
                const updated = await getSupplierById(supplier._id);
                setFreshSupplier(updated);

                const pending = (updated.purchaseHistory || []).filter(
                    (inv: any) => inv.status === "pending"
                );
                setPendingInvoices(pending);
            } catch (err) {
                console.error(err);
            }
        })();

        reset({ amount: "", paymentMethod: "cash", notes: "" });
    }, [supplier, reset]);

    if (!freshSupplier) return null;

    const onSubmit = async (values: any) => {
        try {
            setLoading(true);

            const amount = Number(values.amount);
            if (!amount || amount <= 0) {
                toast.error("Enter a valid amount");
                return;
            }

            if (amount > freshSupplier.outstandingBalance) {
                toast.error("Amount exceeds outstanding balance");
                return;
            }

            // Collect allocations
            const allocations: any[] = [];
            for (const inv of pendingInvoices) {
                const el = document.querySelector<HTMLInputElement>(
                    `input[name="alloc_${inv._id}"]`
                );
                if (!el) continue;

                const v = Number(el.value || 0);
                if (v > 0) allocations.push({ invoice: inv._id, amount: v });
            }

            const allocSum = allocations.reduce((s, a) => s + a.amount, 0);
            if (allocSum > amount) {
                toast.error("Allocated amounts exceed payment amount");
                return;
            }

            // Submit
            await createSupplierPayment(freshSupplier._id, {
                amount,
                paymentMethod: values.paymentMethod,
                notes: values.notes || undefined,
                appliedInvoices: allocations.length ? allocations : undefined,
            });

            toast.success("Payment recorded successfully!");
            onSuccess();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Outstanding Balance */}
            <div className="border-gradient-2 rounded-lg p-4">
                <p className="text-sm text-gray-300 font-semibold">Outstanding Balance</p>
                <p className="text-2xl font-bold mt-1">
                    {formatCurrencyLKR(freshSupplier.outstandingBalance)}
                </p>

                <InputField
                    name="amount"
                    label="Amount to Pay"
                    type="number"
                    placeholder="Enter amount"
                    register={register}
                    error={errors.amount}
                    validation={{ required: "Amount is required" }}
                />
            </div>

            {/* Invoice Allocation */}
            {pendingInvoices.length > 0 && (
                <div className="border-gradient-2 rounded-lg p-4 space-y-2">
                    <p className="font-semibold">Allocate to Invoices (Optional)</p>

                    {pendingInvoices.map((inv) => (
                        <div key={inv._id} className="flex justify-between bg-white/5 p-2 rounded-md">
                            <div>
                                <p className="font-medium">
                                    Invoice #{inv.invoiceNumber ?? inv._id}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {formatCurrencyLKR(inv.totalAmount)}
                                </p>
                            </div>

                            <input
                                type="number"
                                name={`alloc_${inv._id}`}
                                min="0"
                                className="w-28 p-1 text-right bg-black/20 rounded"
                                placeholder="0"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Payment Method */}
            <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                    <SelectField
                        {...field}
                        name="paymentMethod"
                        label="Payment Method"
                        options={[
                            { value: "cash", label: "Cash" },
                            { value: "online_transfer", label: "Online Transfer" },
                        ]}
                    />
                )}
            />

            {/* Notes */}
            <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                    <TextareaField
                        name="notes"
                        label="Notes (optional)"
                        placeholder="Enter notes"
                        register={register}
                        error={errors.notes}
                        validation={{}}
                        disabled={false}
                        value={field.value}
                        rows={3}
                        maxWords={200}
                    />
                )}
            />


            {/* Actions */}
            <div className="sticky -bottom-px bg-black-500 flex gap-3 py-3 border-t border-gray-800">
                <Button
                    type="button"
                    onClick={onCancel}
                    variant="outline"
                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                    Cancel
                </Button>

                <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    {loading ? "Processing..." : "Record Payment"}
                </Button>
            </div>
        </form>
    );
}
