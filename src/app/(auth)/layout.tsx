import Image from "next/image";
import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

const AuthLayout = ({ children }: { children: ReactNode }) => {
    const Year = new Date().getFullYear();

    return (
        <main className="auth-layout">
            <section className="auth-left-section">

                <div className="auth-container">
                    <div className="auth-logo-container">
                        <Image
                            src="/images/FutureTechLogo.png"
                            alt="Logo"
                            width={500}
                            height={500}
                            priority
                            className="w-full h-full object-contain rounded-2xl"
                        />
                    </div>

                    <div className="auth-children">
                        {children}
                    </div>

                    <div className="flex flex-col gap-4 w-full text-center mt-5">
                        <Separator />
                        <p className="text-xs lg:text-sm text-secondary-100">
                            &copy; {Year} FutureTech. All rights reserved.
                        </p>
                    </div>
                </div>

            </section>

            <section className="auth-right-section">
                <div className="z-10 relative lg:mt-4 lg:mb-16">
                    <blockquote className="auth-blockquote">
                        An innovative computer shop management system designed and developed with MERN stack.
                    </blockquote>

                    <div>
                        <cite className="auth-testimonial-author">
                            - Muhammad Hashir.
                        </cite>
                        <p className="max-md:text-xs text-gray-500">
                            Software Engineering Undergratuate
                        </p>
                    </div>
                </div>

                <div className="flex-1 relative">
                    <Image
                        src="/images/AdminDashboard.png"
                        alt="Dashboard Preview"
                        width={1440}
                        height={1150}
                        className="auth-dashboard-preview"
                    />
                </div>
            </section>
        </main>
    );
}

export default AuthLayout;