"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface DialogBoxProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    children?: React.ReactNode;
    showFooter?: boolean;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    disableConfirm?: boolean;
    widthClass?: string;
    showCloseIcon?: boolean;
    variant?: "default" | "danger" | "success" | "warning" | "info";
}

const DialogBox = ({
    open,
    onOpenChange,
    title,
    description,
    children,
    showFooter = false,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    disableConfirm = false,
    widthClass = "w-full max-w-2xl",
    showCloseIcon = true,
    variant = "default",
}: DialogBoxProps) => {
    const variantStyles = {
        default: "bg-blue-600 hover:bg-blue-700 text-white border-blue-700",
        danger: "bg-red-700 hover:bg-red-500 text-white border-red-700",
        success: "bg-green-600 hover:bg-green-700 text-white border-green-700",
        warning: "bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-600",
        info: "bg-gray-600 hover:bg-gray-700 text-white border-gray-700",
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "text-gray-100 border border-gray-800 rounded-xl p-0 z-50 shadow-lg min-w-2xl",
                    widthClass
                )}
            >
                {!title && (
                    <VisuallyHidden>
                        <DialogTitle>Dialog Window</DialogTitle>
                    </VisuallyHidden>
                )}

                {/* Header */}
                {(title || description || showCloseIcon) && (
                    <DialogHeader className="border-b border-gray-800 px-6 py-4 flex justify-between items-start">
                        <div>
                            {title && (
                                <DialogTitle className="text-lg font-semibold">
                                    {title}
                                </DialogTitle>
                            )}
                            {description && (
                                <DialogDescription className="text-sm text-gray-400 mt-1">
                                    {description}
                                </DialogDescription>
                            )}
                        </div>
                    </DialogHeader>
                )}

                {/* Scrollable content area */}
                {children && (
                    <div
                        className="px-6 overflow-y-auto"
                        style={{
                            maxHeight: "calc(80vh - 6rem)",
                        }}
                    >
                        {children}
                    </div>
                )}

                {/* Footer */}
                {showFooter && (
                    <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full border-t border-gray-800 px-6 py-4">
                        <Button
                            variant="outline"
                            onClick={onCancel ?? (() => onOpenChange(false))}
                            className="flex-1 border-gray-700 hover:bg-gray-800"
                        >
                            {cancelText}
                        </Button>

                        <Button
                            onClick={onConfirm}
                            disabled={disableConfirm}
                            className={cn(
                                "sm:w-auto flex-1 transition-colors border",
                                variantStyles[variant]
                            )}
                        >
                            {confirmText}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DialogBox;
