"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";
import Stepper from "@/components/forms/Stepper";

const ForgotPassword = () => {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const steps = ["Email", "Verify OTP", "Reset Password"];

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<IForgotPasswordForm>({ mode: "onBlur" });

    const onSubmit: SubmitHandler<IForgotPasswordForm> = (data) => {
        if (step < 4) setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
        console.log("Form Data:", data);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full px-8">

            {step < 4 && <Stepper steps={steps} currentStep={step} />}

            {/* Step 1: Enter Email */}
            {step === 1 && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full mt-4">

                    <div className="flex flex-col gap-1 items-center justify-center w-full">
                        <h1 className="text-2xl font-semibold ">Reset Password</h1>
                        <p className="text-sm text-primary-100 text-center max-w-sm">
                            Enter your email address to receive OTP.
                        </p>
                    </div>

                    <InputField
                        name="email"
                        placeholder="Enter your email"
                        register={register}
                        error={errors.email}
                        validation={{
                            required: "Email is required",
                            pattern: { value: /^\w+@\w+\.\w+$/, message: "Invalid email address" },
                        }}
                    />

                    <Button type="submit" className="w-full">Send OTP</Button>
                </form>
            )}

            {/* Step 2: Enter OTP */}
            {step === 2 && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full mt-4">
                    <div className="flex flex-col gap-1 items-center justify-center w-full">
                        <h1 className="text-2xl font-semibold ">Verify OTP</h1>
                        <p className="text-sm text-primary-100 text-center max-w-sm">
                            Enter the 6-digit OTP sent to your email.
                        </p>
                    </div>

                    <InputField
                        name="otp"
                        label="OTP"
                        placeholder="Enter OTP"
                        register={register}
                        error={errors.otp}
                        validation={{
                            required: "OTP is required",
                            minLength: { value: 6, message: "OTP must be 6 digits" },
                            maxLength: { value: 6, message: "OTP must be 6 digits" },
                        }}
                    />

                    <Button type="submit" className="w-full">Verify OTP</Button>
                </form>
            )}

            {/* Step 3: Reset Password */}
            {step === 3 && (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1 items-center justify-center w-full">
                        <h1 className="text-2xl font-semibold ">New Password</h1>
                        <p className="text-sm text-primary-100 text-center max-w-sm">
                            Enter your new password and confirm it.
                        </p>
                    </div>


                    <InputField
                        name="newPassword"
                        label="New Password"
                        placeholder="Enter new password"
                        type="password"
                        register={register}
                        error={errors.newPassword}
                        validation={{
                            required: "New password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters" },
                        }}
                    />

                    <InputField
                        name="confirmPassword"
                        label="Confirm Password"
                        placeholder="Confirm new password"
                        type="password"
                        register={register}
                        error={errors.confirmPassword}
                        validation={{
                            required: "Please confirm password",
                            validate: (value: string) => value === watch("newPassword") || "Passwords do not match",
                        }}
                    />

                    <Button type="submit" className="w-full">Reset Password</Button>
                </form>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
                <div className="flex flex-col gap-4 items-center">
                    <p className="text-center text-primary-100 text-sm">
                        Your password has been reset successfully!
                    </p>

                    <Link href="/sign-in" className="w-full">
                        <Button className="w-full">Continue</Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
