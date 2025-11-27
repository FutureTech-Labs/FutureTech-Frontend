"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KPIProps {
    title: string;
    value?: string | number;
    icon?: ReactNode;
    iconBg?: string;
    gradient?: string;
    children?: ReactNode;
    className?: string;
}

const KPI = ({
    title,
    value,
    icon,
    iconBg = "bg-emerald-500/10",
    gradient,
    children,
    className,
}: KPIProps) => {
    return (
        <div
            className={cn(
                "flex items-center justify-between py-4 md:py-2 px-6 md:px-4 rounded-2xl border border-white/10 shadow shadow-gray-600 transition-all duration-300",
                className
            )}
            style={{
                background: gradient
                    ? gradient
                    : "linear-gradient(79.74deg, rgba(166, 255, 0, 0.12) 0%, rgba(0, 0, 0, 0.12) 100%)",
            }}
        >
            {/* LEFT SIDE */}
            <div className="flex flex-col">
                <p className="text-sm text-gray-400">{title}</p>

                {value !== undefined && (
                    <h2 className="text-gradient text-lg font-semibold mt-1">
                        {value}
                    </h2>
                )}

                {children && <div className="mt-1">{children}</div>}
            </div>

            {/* RIGHT SIDE ICON */}
            {icon && (
                <div
                    className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-xl",
                        iconBg
                    )}
                >
                    {icon}
                </div>
            )}
        </div>
    );
};

export default KPI;
