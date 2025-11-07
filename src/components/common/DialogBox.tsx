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

interface DialogBoxProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    showFooter?: boolean;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    disableConfirm?: boolean;
    widthClass?: string;
}

export const DialogBox: React.FC<DialogBoxProps> = ({
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
    widthClass = "max-w-md",
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={`bg-[#0B0B0B] text-gray-100 border border-gray-800 rounded-xl p-6 ${widthClass}`}
            >
                {(title || description) && (
                    <DialogHeader>
                        {title && <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>}
                        {description && (
                            <DialogDescription className="text-sm text-gray-400">
                                {description}
                            </DialogDescription>
                        )}
                    </DialogHeader>
                )}

                <div className="py-3">{children}</div>

                {showFooter && (
                    <DialogFooter className="flex gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={onCancel ?? (() => onOpenChange(false))}
                            className="border-gray-700 hover:bg-gray-800"
                        >
                            {cancelText}
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={disableConfirm}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {confirmText}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};
