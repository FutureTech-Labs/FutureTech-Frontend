"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
    text: string;
    color?:
    | "red"
    | "green"
    | "yellow"
    | "blue"
    | "gray"
    | "orange"
    | "purple"
    | "teal"
    | "pink"
    | "black";
    icon?: ReactNode;
    className?: string;
}

export function StatusBadge({
    text,
    color = "gray",
    icon,
    className,
}: StatusBadgeProps) {
    const colorClasses: Record<string, string> = {
        red: "bg-red-400/15 text-red-400 border-red-400/30",
        green: "bg-green-500/15 text-green-500 border-green-500/30",
        yellow: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
        blue: "bg-blue-500/15 text-blue-500 border-blue-500/30",
        gray: "bg-zinc-700/20 text-zinc-400 border-zinc-500/30",
        orange: "bg-orange-500/15 text-orange-500 border-orange-500/30",
        purple: "bg-purple-500/15 text-purple-500 border-purple-500/30",
        teal: "bg-teal-500/15 text-teal-500 border-teal-500/30",
        pink: "bg-pink-500/15 text-pink-500 border-pink-500/30",
        black: "bg-zinc-900/20 text-zinc-900 border-zinc-900/30",
    };

    return (
        <Badge
            variant="outline"
            className={cn(
                "px-3 py-1 text-xs font-medium flex items-center gap-1",
                colorClasses[color],
                className
            )}
        >
            {icon && <span className="text-current w-3 h-3">{icon}</span>}
            {text}
        </Badge>
    );
}
