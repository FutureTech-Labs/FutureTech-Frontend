"use client";

import {
    useEffect,
    useMemo,
    useState
} from "react";
import { toast } from "sonner";
import InputField from "./InputField";
import SelectField from "./SelectField";
import TextareaField from "./TextAreaField";
import { Button } from "@/components/ui/button";
import { formatCurrencyLKR } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";

import { getSupplierById } from "@/services/supplierServices";
import { createSupplierPayment } from "@/services/supplierPayments";

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
    const [freshSupplier, setFreshSupplier] = useState<ISupplier | null>(supplier);

    const {
        handleSubmit,
        register,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            amount: "",
            paymentMethod: "cash",
            notes: "",
        },
    });

    const watchAmount = Number(watch("amount") || 0);

    // Fetch supplier data
    useEffect(() => {
        if (!supplier?._id) return;

        (async () => {
            try {
                const fresh = await getSupplierById(supplier._id);
                setFreshSupplier(fresh);
            } catch (err) {
                console.error(err);
            }
        })();

        reset({ amount: "", paymentMethod: "cash", notes: "" });
    }, [supplier, reset]);

    if (!freshSupplier) return null;

    // -------------------------------------
    // AUTO-ALLOCATION (FIFO)
    // -------------------------------------
    const fifoAllocations = useMemo(() => {
        let remaining = watchAmount;
        const result: {
            invoiceId: string;
            invoiceNumber?: string;
            total: number;
            paidBefore: number;
            remainingBefore: number;
            applyNow: number;
            remainingAfter: number;
        }[] = [];

        freshSupplier.purchaseHistory
            ?.filter((inv) => inv.status === "pending")
            .sort((a, b) => new Date(a.date as string).getTime() - new Date(b.date as string).getTime())
            .forEach((inv) => {
                const total = inv.totalAmount ?? 0;
                const paidBefore = inv.alreadyPaid ?? 0;
                const remainingBefore = total - paidBefore;

                if (remaining <= 0) {
                    result.push({
                        invoiceId: inv._id,
                        invoiceNumber: inv.invoiceNumber,
                        total,
                        paidBefore,
                        remainingBefore,
                        applyNow: 0,
                        remainingAfter: remainingBefore,
                    });
                    return;
                }

                const payThis = Math.min(remaining, remainingBefore);
                remaining -= payThis;

                result.push({
                    invoiceId: inv._id,
                    invoiceNumber: inv.invoiceNumber,
                    total,
                    paidBefore,
                    remainingBefore,
                    applyNow: payThis,
                    remainingAfter: remainingBefore - payThis,
                });
            });

        return result;
    }, [freshSupplier, watchAmount]);

    // -------------------------------------
    // SUBMIT PAYMENT
    // -------------------------------------
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

            await createSupplierPayment(freshSupplier._id, {
                amount,
                paymentMethod: values.paymentMethod,
                notes: values.notes || undefined,
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Outstanding Balance */}
            <div className="border border-white/10 bg-white/5 rounded-lg p-4">
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

            {/* AUTO ALLOCATION PREVIEW */}
            {fifoAllocations.length > 0 && (
                <div className="border border-white/10 bg-white/5 rounded-lg p-4 space-y-3">
                    <p className="font-semibold text-gray-200 text-sm">
                        Auto Allocation (FIFO)
                    </p>

                    {fifoAllocations.map((row) => {
                        const applyNow = watchAmount > 0 ? row.applyNow : 0;
                        const remainingAfter =
                            watchAmount > 0 ? row.remainingAfter : row.remainingBefore;

                        return (
                            <div
                                key={row.invoiceId}
                                className="bg-black/20 border border-white/10 rounded-lg p-3"
                            >
                                <p className="font-medium text-white">
                                    Invoice #{row.invoiceNumber}
                                </p>

                                <div className="text-xs text-gray-400 mt-1 space-y-1">
                                    <p>Total: {formatCurrencyLKR(row.total)}</p>
                                    <p>Paid Before: {formatCurrencyLKR(row.paidBefore)}</p>
                                    <p>Remaining Before: {formatCurrencyLKR(row.remainingBefore)}</p>
                                </div>

                                <div className="text-sm mt-2 flex justify-between">
                                    <span className="text-gray-300">Will Pay Now:</span>
                                    <span className="text-primary-300 font-semibold">
                                        {formatCurrencyLKR(applyNow)}
                                    </span>
                                </div>

                                <div className="text-sm flex justify-between mt-1">
                                    <span className="text-gray-300">Remaining After:</span>
                                    <span className="text-yellow-300 font-semibold">
                                        {formatCurrencyLKR(remainingAfter)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
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

            {/* Footer Buttons */}
            <div className="sticky -bottom-px bg-black-500 flex gap-3 py-3 border-t border-gray-800">
                <Button
                    type="button"
                    onClick={onCancel}
                    variant="outline"
                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                    {loading ? "Processing..." : "Record Payment"}
                </Button>
            </div>
        </form>
    );
}
