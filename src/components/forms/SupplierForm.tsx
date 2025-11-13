"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import InputField from "./InputField";
import TextareaField from "./TextAreaField";
import SelectField from "./SelectField";
import { Button } from "@/components/ui/button";

import { createSupplier, updateSupplier } from "@/services/supplierServices";

interface SupplierFormProps {
    supplier?: ISupplier | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

interface SupplierFormValues {
    name: string;
    company: string;
    email: string;
    contact: string;
    address: string;
    paymentTerms: "COD" | "Net 15" | "Net 30" | "Net 45";
    status: "paid" | "pending";
    bankName: string;
    accountNumber: string;
}

const PAYMENT_TERM_OPTIONS = [
    { value: "COD", label: "Cash On Delivery" },
    { value: "Net 15", label: "Net 15 Days" },
    { value: "Net 30", label: "Net 30 Days" },
    { value: "Net 45", label: "Net 45 Days" },
];

export default function SupplierForm({
    supplier,
    onSuccess,
    onCancel,
}: SupplierFormProps) {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<SupplierFormValues>({
        defaultValues: {
            name: "",
            company: "",
            email: "",
            contact: "",
            address: "",
            paymentTerms: "COD",
            status: "paid", // ✅ CORRECT DEFAULT
            bankName: "",
            accountNumber: "",
        },
    });

    const [loading, setLoading] = useState(false);

    // Prefill form on edit
    useEffect(() => {
        if (supplier) {
            reset({
                name: supplier.name,
                company: supplier.company,
                email: supplier.email,
                contact: supplier.contact,
                address: supplier.address,
                paymentTerms: supplier.paymentTerms,
                status: supplier.status as "paid" | "pending", // ensure correct type
                bankName: supplier.bankDetails?.bankName || "",
                accountNumber: supplier.bankDetails?.accountNumber || "",
            });
        } else {
            reset({
                name: "",
                company: "",
                email: "",
                contact: "",
                address: "",
                paymentTerms: "COD",
                status: "paid",
                bankName: "",
                accountNumber: "",
            });
        }
    }, [supplier, reset]);

    const onSubmit: SubmitHandler<SupplierFormValues> = async (data) => {
        try {
            setLoading(true);

            const payload = {
                name: data.name.trim(),
                company: data.company.trim(),
                email: data.email.trim(),
                contact: data.contact.trim(),
                address: data.address.trim(),
                paymentTerms: data.paymentTerms,
                status: supplier ? supplier.status : "paid", // NOT editable
                bankDetails: {
                    bankName: data.bankName.trim(),
                    accountNumber: data.accountNumber.trim(),
                },
            };

            if (supplier?._id) {
                await updateSupplier(supplier._id, payload);
                toast.success("Supplier updated successfully!");
            } else {
                await createSupplier(payload);
                toast.success("Supplier added successfully!");
            }

            onSuccess?.();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to save supplier.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset
                disabled={loading}
                className={`space-y-4 ${loading ? "opacity-50 pointer-events-none" : ""}`}
            >
                <InputField
                    name="name"
                    label="Supplier Name"
                    placeholder="Enter supplier name"
                    register={register}
                    error={errors.name}
                    validation={{ required: "Supplier name is required" }}
                />

                <InputField
                    name="company"
                    label="Company Name"
                    placeholder="Enter company name"
                    register={register}
                    error={errors.company}
                    validation={{ required: "Company name is required" }}
                />

                <InputField
                    name="email"
                    label="Email"
                    placeholder="Enter email"
                    register={register}
                    error={errors.email}
                    validation={{
                        required: "Email is required",
                        pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: "Invalid email format",
                        },
                    }}
                />

                <InputField
                    name="contact"
                    label="Contact Number"
                    placeholder="0771234567"
                    register={register}
                    error={errors.contact}
                    validation={{
                        required: "Contact number is required",
                        pattern: {
                            value: /^[0-9]{10,15}$/,
                            message: "Enter a valid phone number",
                        },
                    }}
                />

                <TextareaField
                    name="address"
                    label="Address"
                    placeholder="Enter supplier address"
                    register={register}
                    error={errors.address}
                />

                {/* Payment Terms */}
                <Controller
                    name="paymentTerms"
                    control={control}
                    render={({ field }) => (
                        <SelectField
                            {...field}
                            name="paymentTerms"
                            label="Payment Terms"
                            options={PAYMENT_TERM_OPTIONS}
                            placeholder="Select terms"
                        />
                    )}
                />

                {/* Status (SelectField + disabled on edit) */}
                {supplier && (
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <SelectField
                                {...field}
                                name="status"
                                label="Status"
                                options={[
                                    { value: "paid", label: "Paid" },
                                    { value: "pending", label: "Pending" },
                                ]}
                                disabled // <— works now
                            />
                        )}
                    />
                )}

                <InputField
                    name="bankName"
                    label="Bank Name"
                    placeholder="Enter bank name"
                    register={register}
                    error={errors.bankName}
                />

                <InputField
                    name="accountNumber"
                    label="Account Number"
                    placeholder="Enter account number"
                    register={register}
                    error={errors.accountNumber}
                />

                <div className="flex gap-3 pt-5 border-t border-gray-800">
                    <Button
                        type="button"
                        onClick={onCancel}
                        variant="outline"
                        className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                        Cancel
                    </Button>

                    <Button type="submit" className="flex-1 main-button-gradient">
                        {supplier ? "Update Supplier" : "Save Supplier"}
                    </Button>
                </div>
            </fieldset>
        </form>
    );
}
