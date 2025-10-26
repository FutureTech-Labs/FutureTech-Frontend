'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Unauthorized = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-6 p-6 rounded-2xl bg-card shadow-lg border border-border">
                <div className="text-center">
                    <div className="mx-auto h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                        <svg
                            className="h-10 w-10 text-destructive"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-3">Access Denied</h1>
                    <p className="text-muted-foreground mb-5 leading-relaxed">
                        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
                    </p>
                </div>

                <Button
                    onClick={() => router.push('/')}
                    className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 font-medium shadow-sm cursor-pointer"
                >
                    Return to Home
                </Button>

                <div className="text-center pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                        Need help?{" "}
                        <Link
                            href="mailto:hashirmohamed04@gmail.com"
                            className="text-primary hover:text-primary-200 font-medium transition-colors duration-200"
                        >
                            Contact Support
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Unauthorized;