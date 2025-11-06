import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface IconButtonProps {
    title?: string;
    iconSrc?: string;
    icon?: LucideIcon;
    ariaLabel?: string;
    disabled?: boolean;
    className?: string;
    children?: React.ReactNode;
    size?: "xs" | "sm" | "md" | "lg";
    variant?: "default" | "ghost" | "outline" | "destructive";
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function IconButton({
    title,
    iconSrc,
    onClick,
    children,
    ariaLabel,
    icon: Icon,
    size = "lg",
    className = "",
    disabled = false,
    variant = "ghost",
}: IconButtonProps) {
    const sizeMap: Record<string, { p: string; icon: string }> = {
        xs: { p: "p-1", icon: "h-3 w-3" },
        sm: { p: "p-1.5", icon: "h-3.5 w-3.5" },
        md: { p: "p-2", icon: "h-4 w-4" },
        lg: { p: "p-3", icon: "h-6 w-6" },
    };

    const sz = sizeMap[size] ?? sizeMap["lg"];
    const btnClass = `${sz.p} ${className}`.trim();

    return (
        <Button
            variant={variant as any}
            className={`${btnClass} cursor-pointer `}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            title={title}
        >
            {Icon ? (
                <Icon className={`${sz.icon}`} aria-hidden />
            ) : iconSrc ? (
                <Image
                    src={iconSrc}
                    alt={ariaLabel || "icon"}
                    width={20}
                    height={20}
                    className={`object-contain ${sz.icon}`}
                />
            ) : null}

            {children ? <span className="ml-2">{children}</span> : null}
        </Button>
    );
};