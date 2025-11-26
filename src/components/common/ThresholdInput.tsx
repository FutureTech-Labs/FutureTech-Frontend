"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import DialogBox from "../common/DialogBox";

interface ThresholdInputProps {
    value: number;
    onSubmit: (newValue: number) => void;
}

const ThresholdInput = ({ value, onSubmit }: ThresholdInputProps) => {
    const [threshold, setThreshold] = useState(value);
    const [changedValue, setChangedValue] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // debounce timer
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setThreshold(value);
    }, [value]);

    const openConfirmDialog = (newVal: number) => {
        setChangedValue(newVal);
        setDialogOpen(true);
    };

    const handleBlur = () => {
        if (threshold !== value) {
            openConfirmDialog(threshold);
        }
    };

    const scheduleDialog = (newVal: number) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            if (newVal !== value) {
                openConfirmDialog(newVal);
            }
        }, 1000);
    };

    const increment = () => {
        const newVal = threshold + 1;
        setThreshold(newVal);
        scheduleDialog(newVal);
    };

    const decrement = () => {
        const newVal = threshold > 0 ? threshold - 1 : 0;
        setThreshold(newVal);
        scheduleDialog(newVal);
    };

    const handleChange = (val: string) => {
        const numeric = val.replace(/\D/g, "");
        const newVal = numeric === "" ? 0 : Number(numeric);
        setThreshold(newVal);
    };

    const handleConfirmSave = () => {
        if (changedValue != null) {
            onSubmit(changedValue);
        }
        setDialogOpen(false);
    };

    const handleCancelSave = () => {
        setThreshold(value); // revert
        setDialogOpen(false);
    };

    return (
        <>
            {/* MAIN UI */}
            <div
                className={cn(
                    "flex items-center rounded-xl border border-white/70 pl-3 pr-1 py-1 gap-3 backdrop-blur-sm"
                )}
            >
                <span className="font-medium">Set Minimum Threshold</span>

                <div className="flex items-center gap-1 button-gradient-1 rounded-xl px-1 py-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={decrement}
                        className="h-8 w-8 cursor-pointer"
                    >
                        <Minus />
                    </Button>

                    <Input
                        type="text"
                        value={threshold}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        className={cn(
                            "w-12 h-8 text-center bg-black-500!",
                            "font-bold disable-rings"
                        )}
                    />

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={increment}
                        className="h-8 w-8 rounded-lg cursor-pointer"
                    >
                        <Plus />
                    </Button>
                </div>
            </div>

            {/* CONFIRMATION DIALOG */}
            <DialogBox
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                title="Confirm Threshold Update"
                description={`Do you want to update the global minimum threshold to ${changedValue}?`}
                showFooter
                confirmText="Save"
                cancelText="Cancel"
                onConfirm={handleConfirmSave}
                onCancel={handleCancelSave}
                centerTitle
                variant="default"
                widthClass="max-w-sm!"
            >
                <div className="py-4 text-primary-100 text-center">
                    This will update the global minimum stock threshold and may trigger
                    low stock alerts for certain products.
                </div>
            </DialogBox>
        </>
    );
};

export default ThresholdInput;
