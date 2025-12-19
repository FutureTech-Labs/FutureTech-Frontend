"use client";

import {
    useState,
    startTransition
} from "react";

import { toast } from "sonner";

import {
    createSale,
    getSaleById
} from "@/services/salesServices";

import { useSalesCart } from "@/stores/useSalesCart";

import { FileText } from "lucide-react";
import InputField from "./InputField";
import { Button } from "../ui/button";
import SelectField from "./SelectField";

import { useForm } from "react-hook-form";

interface SalesFormProps {
    onSuccess: (data: IGetSaleByIdResponse) => void;
}

export default function SalesForm({ onSuccess }: SalesFormProps) {
    const [loading, setLoading] = useState(false);
    const { items, clear } = useSalesCart();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            customerName: "",
            customerEmail: "",
            customerContact: "",
            paymentMethod: "cash" as "cash" | "card",
        },
        mode: "onSubmit",
    });

    const onSubmit = async (formData: any) => {
        if (items.length === 0) {
            toast.error("Cart is empty.");
            return;
        }

        setLoading(true);
        let loadingToast: string | number | undefined = undefined;

        try {
            const payload: ICreateSaleRequest = {
                customer: {
                    name: formData.customerName,
                    email: formData.customerEmail,
                    contact: formData.customerContact,
                },
                paymentMethod: formData.paymentMethod,
                items: items.map((i) => ({
                    product: i.product._id,
                    quantity: i.quantity,
                    sellingPrice: i.product.sellingPrice,
                    discount: i.discount,
                })),
                tax: 0,
            };

            loadingToast = toast.loading("Processing sale...");

            const res = await createSale(payload);

            toast.success("Sale created successfully!", {
                id: loadingToast,
            });

            startTransition(async () => {
                const invoiceFull = await getSaleById(res.invoice._id);
                clear();
                reset();
                onSuccess(invoiceFull);
            });

        } catch (err: any) {
            toast.error(
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong",
                { id: loadingToast }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border-2 border-gradient border-primary-900/40 table-bg-gradient rounded-lg flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Customer Details</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                <InputField
                    name="customerName"
                    label="Customer Name"
                    placeholder="Enter customer name"
                    register={register}
                    validation={{ required: "Customer name is required" }}
                    error={errors.customerName}
                />

                <InputField
                    name="customerEmail"
                    label="Email"
                    placeholder="Enter email"
                    register={register}
                    validation={{
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Invalid email format",
                        },
                    }}
                    error={errors.customerEmail}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        name="customerContact"
                        label="Contact Number"
                        placeholder="Enter contact number"
                        register={register}
                        validation={{
                            required: "Contact number is required",
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Enter a valid phone number",
                            },
                        }}
                        error={errors.customerContact}
                    />
                    <SelectField
                        name="paymentMethod"
                        label="Payment Method"
                        placeholder="Select payment type"
                        control={control}
                        options={[
                            { value: "cash", label: "Cash" },
                            { value: "card", label: "Card" },
                        ]}
                        required
                        error={errors.paymentMethod}
                        className="h-12!"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="main-button-gradient text-white rounded-lg hover:bg-blue-700 border border-white/50 cursor-pointer transition disabled:opacity-35"
                >
                    {isSubmitting ? (
                        "Processing..."
                    ) : (
                        <>
                            Create Sale
                            <FileText className="w-4 h-4" />
                        </>
                    )}
                </Button>

            </form>
        </div>
    );
}
