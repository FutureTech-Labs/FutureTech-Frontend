"use client";

import {
    useEffect,
    useState
} from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/InputField";

import {
    createCashier,
    updateCashier,
    resetCashierPassword,
} from "@/services/userServices";

interface UserFormProps {
    user?: ICashier | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

interface UserFormValues {
    name: string;
    email: string;
    password?: string;
}

const UserForm = ({ user, onSuccess, onCancel }: UserFormProps) => {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<UserFormValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const [loading, setLoading] = useState(false);
    const isEdit = Boolean(user);

    const [tempPassword, setTempPassword] = useState<string | null>(null);
    const [confirmReset, setConfirmReset] = useState(false);


    // -------------------------
    // LOAD DATA FOR EDIT MODE
    // -------------------------
    useEffect(() => {
        if (user) {
            reset({
                name: user.name || "",
                email: user.email || "",
                password: "",
            });
        } else {
            reset({
                name: "",
                email: "",
                password: "",
            });
        }
    }, [user, reset]);

    // -------------------------
    // SUBMIT HANDLER
    // -------------------------
    const onSubmit = async (data: UserFormValues) => {
        try {
            setLoading(true);

            if (isEdit && user) {
                await updateCashier(user.id, {
                    name: data.name,
                    email: data.email,
                });
                toast.success("User updated successfully!");
            } else {
                await createCashier({
                    name: data.name,
                    email: data.email,
                    password: data.password || "",
                });
                toast.success("User created successfully!");
            }

            onSuccess?.();
        } catch (error: any) {
            const msg = error?.response?.data?.message?.toLowerCase() || "";

            if (msg.includes("email")) {
                setError("email", { type: "server", message: error.response.data.message });
            } else if (msg.includes("password")) {
                setError("password", { type: "server", message: error.response.data.message });
            } else {
                toast.error(error.response?.data?.message || "Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    // -------------------------
    // RESET PASSWORD HANDLER
    // -------------------------
    const handleResetPassword = async () => {
        if (!user) return;

        try {
            const res = await resetCashierPassword(user.id);
            setTempPassword(res.temporaryPassword);

            setConfirmReset(false);

            // Auto-hide after 10 seconds
            setTimeout(() => setTempPassword(null), 10000);

        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Failed to reset password"
            );
        }
    };

    // -------------------------
    // UI
    // -------------------------
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset
                disabled={loading}
                className={`space-y-6 ${loading ? "pointer-events-none opacity-50" : ""}`}
            >
                {/* -------------------------
                    NAME
                ------------------------- */}
                <InputField
                    name="name"
                    label="Full Name"
                    placeholder="John Doe"
                    register={register}
                    error={errors.name}
                    validation={{ required: "Name is required" }}
                />


                {/* -------------------------
                    EMAIL
                ------------------------- */}
                <InputField
                    name="email"
                    label="Email Address"
                    placeholder="user@example.com"
                    register={register}
                    error={errors.email}
                    validation={{
                        required: "Email is required",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address",
                        },
                    }}
                />

                {/* -------------------------
                    PASSWORD (ADD MODE ONLY)
                ------------------------- */}
                {!isEdit && (

                    <InputField
                        name="password"
                        type="password"
                        label="Password"
                        placeholder="Enter password"
                        register={register}
                        error={errors.password}
                        validation={{
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters",
                            },
                        }}
                    />
                )}

                {/* -------------------------
                    RESET PASSWORD (EDIT ONLY)
                ------------------------- */}
                {isEdit && (
                    !confirmReset ? (
                        <Button
                            type="button"
                            onClick={() => setConfirmReset(true)}
                            variant="destructive"
                            className="w-full text-sm cursor-pointer"
                        >
                            Reset Password
                        </Button>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-5 p-3 rounded-lg border border-gray-800">
                            <h1 className="text-lg">Confirm reset?</h1>

                            <div className="flex gap-2 w-full max-w-sm">
                                <Button
                                    type="button"
                                    onClick={handleResetPassword}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 h-7 text-xs"
                                >
                                    Yes
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 px-3 py-1 h-7 text-xs border-gray-700 text-gray-300 hover:bg-gray-800"
                                    onClick={() => setConfirmReset(false)}
                                >
                                    No
                                </Button>
                            </div>
                        </div>
                    )
                )}


                {/* TEMP PASSWORD DISPLAY */}
                {tempPassword && (
                    <div
                        className="mt-3 p-4 rounded-lg bg-black-700/40 border border-gray-800 text-center animate-in fade-in slide-in-from-bottom-2">
                        <p className="text-xs text-gray-400 mb-1">Temporary Password</p>

                        <p className="text-lg font-semibold tracking-wider text-primary-100">
                            {tempPassword}
                        </p>

                        <p className="text-[10px] text-gray-500 mt-1">
                            Auto-hides in 10 seconds
                        </p>
                    </div>
                )}

                {/* -------------------------
                    FOOTER BUTTONS
                ------------------------- */}
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
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {loading
                            ? isEdit
                                ? "Updating..."
                                : "Saving..."
                            : isEdit
                                ? "Update User"
                                : "Save User"}
                    </Button>
                </div>
            </fieldset>
        </form>
    );
};

export default UserForm;
