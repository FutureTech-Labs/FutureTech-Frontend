"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    iconBg?: string;
    gradient?: string;
}

const StatCard = ({
    title,
    value,
    icon,
    iconBg = "bg-emerald-500/10",
    gradient,
}: StatCardProps) => {
    return (
        <div
            className={cn(
                "flex items-center justify-between py-4 md:py-2.5 px-6 md:px-5 rounded-2xl border border-white/10 shadow shadow-gray-600 transition-all duration-300"
            )}
            style={{
                background: gradient
                    ? gradient
                    : "linear-gradient(79.74deg, rgba(166, 255, 0, 0.12) 0%, rgba(0, 0, 0, 0.12) 100%)",
            }}
        >
            <div className="flex flex-col">
                <p className="text-sm text-gray-400">{title}</p>
                <h2 className="text-gradient text-lg font-semibold mt-1">{value}</h2>
            </div>

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

export default StatCard;
