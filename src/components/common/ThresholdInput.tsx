"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThresholdInputProps {
    value: number;
    onSubmit: (newValue: number) => void;
}

const ThresholdInput = ({ value, onSubmit }: ThresholdInputProps) => {
    const [threshold, setThreshold] = useState(value);

    // Sync UI when parent changes value
    useEffect(() => {
        setThreshold(value);
    }, [value]);

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSubmit(Number(threshold));
        }
    };

    const increment = () =>
        setThreshold((prev) => prev + 1);

    const decrement = () =>
        setThreshold((prev) => (prev > 0 ? prev - 1 : 0));

    return (
        <div
            className={cn(
                "flex items-center rounded-xl border border-white/30 pl-4 pr-1 py-1 gap-3 backdrop-blur-sm"
            )}
        >
            <span className="font-medium">Set Minimum Threshold</span>

            <div className="flex items-center gap-1 bg-blue-600 rounded-xl px-1 py-1">
                {/* Minus Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrement}
                    className="h-8 w-8 text-white hover:bg-blue-700 rounded-lg"
                >
                    –
                </Button>

                {/* Input (spinner removed) */}
                <Input
                    type="text"
                    value={threshold}
                    onChange={(e) =>
                        setThreshold(Number(e.target.value.replace(/\D/g, "")))
                    }
                    onKeyDown={handleKeyPress}
                    className={cn(
                        "w-12 h-8 text-center bg-transparent border-none",
                        "text-white font-semibold focus-visible:ring-0 focus-visible:ring-offset-0",
                        "placeholder:text-white/70 shadow-none "
                    )}
                />

                {/* Plus Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={increment}
                    className="h-8 w-8 text-white hover:bg-blue-700 rounded-lg"
                >
                    +
                </Button>
            </div>
        </div>
    );
};

export default ThresholdInput;
