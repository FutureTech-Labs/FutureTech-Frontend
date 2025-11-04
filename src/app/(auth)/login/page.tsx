'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { login } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import InputField from '@/components/forms/InputField';

const SignIn = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ISignInFormData>({
        defaultValues: { email: '', password: '', },
        mode: 'onBlur'
    });

    const router = useRouter();

    const onSubmit = async (data: ISignInFormData) => {
        try {
            const res = await login(data.email, data.password);

            if (res.success) {
                toast.success("Login successful!");
                router.replace("/dashboard");
            }
        } catch (error: any) {
            const msg = error?.response?.data?.message?.toString().toLowerCase().trim();

            if (msg?.includes("password")) {
                setError("password", { type: "server", message: error.response.data.message });
            } else if (msg?.includes("email")) {
                setError("email", { type: "server", message: error.response.data.message });
            } else if (msg) {
                console.error(error.response.data.message);
            }
        }
    };

    return (
        <>
            <div className='flex flex-col text-center max-w-sm mb-5 gap-1'>
                <h1 className='text-white text-xl'>Welcome to FutureTech</h1>

                <p className='text-xs lg:text-sm text-primary-100'>
                    Enter your credentials to access your FutureTech account securely.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5 w-full'>

                <InputField
                    name="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    register={register}
                    error={errors.email}
                    validation={{
                        required: "Email is required",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address",
                        }
                    }}
                />

                <InputField
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters long"
                        }
                    }}
                />

                <div className="flex justify-between items-center text-sm text-primary-100">
                    <div className="flex items-center gap-2">
                        <Checkbox id="remember" defaultChecked className='cursor-pointer' />
                        <Label className='text-primary-200'>Remember me</Label>
                    </div>

                    <Link
                        href="/forgot-password"
                        className="text-primary-200 hover:text-primary-100 transition-colors"
                    >
                        Forgot password?
                    </Link>
                </div>

                <Button type='submit' disabled={isSubmitting} className='main-button-gradient w-full'>
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>

            </form>
        </>
    )
}

export default SignIn;