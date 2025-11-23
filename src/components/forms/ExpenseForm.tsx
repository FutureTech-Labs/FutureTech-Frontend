"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";

import {
    createExpense,
    updateExpense
} from "@/services/expenseServices";
import TextareaField from "./TextAreaField";

interface ExpenseFormProps {
    expense?: IExpense | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

/**
 * Categories allowed for manual creation.
 * "Purchase" is EXCLUDED because backend generates it automatically.
 */
export type ManualExpenseCategory =
    | "Electricity"
    | "Water"
    | "Internet"
    | "Rent"
    | "Salary"
    | "Maintenance"
    | "Transport"
    | "Misc";

/**
 * Expense form values
 */
interface ExpenseFormValues {
    category: ManualExpenseCategory;
    amount: number;
    date: string;
    description?: string;
}

/**
 * Dropdown options
 */
const EXPENSE_CATEGORIES: { value: ManualExpenseCategory; label: string }[] = [
    { value: "Electricity", label: "Electricity" },
    { value: "Water", label: "Water" },
    { value: "Internet", label: "Internet" },
    { value: "Rent", label: "Rent" },
    { value: "Salary", label: "Salary" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "Transport", label: "Transport" },
    { value: "Misc", label: "Misc" }
];

const ExpenseForm = ({ expense, onSuccess, onCancel }: ExpenseFormProps) => {
    const isEdit = Boolean(expense);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        setError,
        watch,
        formState: { errors }
    } = useForm<ExpenseFormValues>({
        defaultValues: {
            // category MUST be cast here because react-hook-form allows lazy filling
            category: undefined as unknown as ManualExpenseCategory,
            amount: 0,
            date: new Date().toISOString().slice(0, 10),
            description: ""
        }
    });

    const categoryWatch = watch("category");

    /**
     * Prefill data in edit mode
     */
    useEffect(() => {
        if (expense) {
            reset({
                category: expense.category as ManualExpenseCategory,
                amount: expense.amount,
                date: expense.date.slice(0, 10),
                description: expense.description || ""
            });
        }
    }, [expense, reset]);

    /**
     * Submit handler
     */
    const onSubmit = async (data: ExpenseFormValues) => {
        try {
            setLoading(true);

            // Manual validation for required category
            if (!data.category) {
                setError("category", { type: "manual", message: "Category is required" });
                return;
            }

            if (isEdit && expense) {
                await updateExpense(expense._id, data);
                toast.success("Expense updated successfully!");
            } else {
                await createExpense(data);
                toast.success("Expense created successfully!");
            }

            onSuccess?.();

        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset
                disabled={loading}
                className={`space-y-6 ${loading ? "opacity-50 pointer-events-none" : ""}`}
            >
                {/* CATEGORY */}
                <SelectField
                    label="Category"
                    placeholder="Select Category"
                    value={categoryWatch || ""}
                    onChange={(val) => setValue("category", val as ManualExpenseCategory)}
                    error={errors.category}
                    options={EXPENSE_CATEGORIES}
                    required
                />

                {/* AMOUNT */}
                <InputField
                    name="amount"
                    label="Amount (LKR)"
                    placeholder="0.00"
                    type="number"
                    register={register}
                    error={errors.amount}
                    validation={{
                        required: "Amount is required",
                        min: { value: 1, message: "Amount must be at least 1" }
                    }}
                />

                {/* DATE */}
                <InputField
                    placeholder="Date"
                    name="date"
                    label="Date"
                    type="date"
                    register={register}
                    error={errors.date}
                    validation={{ required: "Date is required" }}
                />

                {/* DESCRIPTION */}
                <TextareaField
                    name="description"
                    label="Description"
                    placeholder="Optional"
                    register={register}
                    error={errors.description}
                    maxWords={150}
                    rows={5}
                    validation={{
                        maxLength: { value: 150, message: "Max 150 characters" }
                    }}
                />

                {/* FOOTER BUTTONS */}
                <div className="sticky -bottom-px bg-black-500 flex gap-3 py-4 border-t border-gray-800">
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
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {loading
                            ? isEdit
                                ? "Updating..."
                                : "Saving..."
                            : isEdit
                                ? "Update Expense"
                                : "Save Expense"}
                    </Button>
                </div>
            </fieldset>
        </form>
    );
};

export default ExpenseForm;
