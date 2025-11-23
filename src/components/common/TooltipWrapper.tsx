"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipWrapperProps {
    children: React.ReactNode;
    content: string;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    className?: string;
}
export function TooltipWrapper({
    children,
    content,
    side = "top",
    align = "center",
    className,
}: TooltipWrapperProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className={className}>{children}</span>
            </TooltipTrigger>

            <TooltipContent side={side} align={align}>
                <p>{content}</p>
            </TooltipContent>
        </Tooltip>
    );
}
