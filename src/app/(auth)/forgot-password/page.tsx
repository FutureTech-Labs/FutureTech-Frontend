"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import Stepper from "@/components/forms/Stepper";
import InputField from "@/components/forms/InputField";
import { ForgotpasswordStepContent } from "@/constants";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { InputOTP, InputOTPGroup, InputOTPSlot, } from "@/components/ui/input-otp";

const ForgotPassword = () => {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const steps = ["Reset Password", "Verify OTP", "Set New Password"];

    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm<IForgotPasswordForm>({
        mode: "onBlur",
    });

    const onSubmit: SubmitHandler<IForgotPasswordForm> = (data: IForgotPasswordForm) => {
        console.log("Form Data:", data);
        if (step < 4) setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full lg:px-8">
            {/* Stepper */}
            {step < 4 && <Stepper steps={steps} currentStep={step} />}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">

                {/* Title + description */}
                <div className="flex flex-col items-center gap-2 mt-4">
                    <h2 className="text-2xl font-semibold text-white">
                        {ForgotpasswordStepContent[step - 1].title}
                    </h2>
                    <p className="text-sm text-gray-400">
                        {ForgotpasswordStepContent[step - 1].description}
                    </p>
                </div>

                {/* Step 1: Email */}
                {step === 1 && (
                    <InputField
                        name="email"
                        placeholder="Enter your email"
                        register={register}
                        error={errors.email}
                        validation={{
                            required: "Email is required",
                            pattern: {
                                value: /^\w+@\w+\.\w+$/,
                                message: "Invalid email address",
                            },
                        }}
                    />
                )}

                {/* Step 2: OTP */}
                {step === 2 && (
                    <div className="flex flex-col items-center gap-2.5">
                        <Controller
                            name="otp"
                            control={control}
                            rules={{
                                required: "OTP is required",
                                minLength: { value: 6, message: "OTP must be 6 digits" },
                            }}
                            render={({ field }) => (
                                <InputOTP
                                    maxLength={6}
                                    pattern={REGEXP_ONLY_DIGITS}
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    className="flex justify-center"
                                >
                                    <InputOTPGroup>
                                        {[...Array(6)].map((_, i) => (
                                            <InputOTPSlot key={i} index={i} className="mx-1 lg:mx-2 border border-white/35 w-10 h-10 rounded-md" />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                            )}
                        />

                        {errors.otp && (
                            <p className="text-error-500 text-sm">{errors.otp.message}</p>
                        )}
                    </div>
                )}


                {/* Step 3: Reset Password */}
                {step === 3 && (
                    <>
                        <InputField
                            name="newPassword"
                            label="New Password"
                            placeholder="Enter new password"
                            type="password"
                            register={register}
                            error={errors.newPassword}
                            validation={{
                                required: "New password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters long",
                                },
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
                                required: "Please confirm your password",
                                validate: (value: string) =>
                                    value === watch("newPassword") || "Passwords do not match",
                            }}
                        />
                    </>
                )}

                {/* step 4: Success */}
                {step === 4 && (
                    <Link href="/sign-in" className="w-full">
                        <Button className="w-full main-button-gradient">Continue</Button>
                    </Link>
                )}

                {/* Buttons */}
                {step < 4 && (
                    <div className="relative flex gap-2 w-full">
                        {step === 1 ? (
                            <>
                                {/* Back Button */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 h-10 !border-white/40"
                                    onClick={() => router.back()}
                                >
                                    Back
                                </Button>

                                {/* Submit Button */}
                                <Button type="submit" className="flex-1 main-button-gradient">
                                    Send OTP
                                </Button>
                            </>
                        ) : (

                            <Button type="submit" className="w-full mt-2 main-button-gradient">
                                {step === 2 ? "Verify OTP" : "Reset Password"}
                            </Button>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
};

export default ForgotPassword;
