"use client";

import { useSalesCart } from "@/stores/useSalesCart";
import { createSale, getSaleById } from "@/services/salesServices";

import { useForm } from "react-hook-form";
import InputField from "./InputField";
import SelectField from "./SelectField";

interface SalesFormProps {
    onSuccess: (data: IGetSaleByIdResponse) => void;
}

export default function SalesForm({ onSuccess }: SalesFormProps) {
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
            alert("Cart is empty.");
            return;
        }

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

            // Create sale
            const res = await createSale(payload);

            // Fetch full invoice with product name fixed from backend
            const invoiceFull = await getSaleById(res.invoice._id);

            clear();
            reset();

            onSuccess(invoiceFull);

        } catch (err: any) {
            alert(err?.response?.data?.message || "Error creating sale");
        }
    };

    return (
        <div className="bg-gray-900/40 p-4 border border-gray-700 rounded-lg flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Create Sale</h2>

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

                <InputField
                    name="customerContact"
                    label="Contact Number"
                    placeholder="Enter contact"
                    register={register}
                    validation={{ required: "Contact number is required" }}
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
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-600"
                >
                    {isSubmitting ? "Processing..." : "Create Sale"}
                </button>

            </form>
        </div>
    );
}
