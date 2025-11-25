"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DatePickerFieldProps {
    label?: string;
    value?: string;
    onChange: (date: string) => void;
    disabled?: boolean;
    error?: any;
}

export default function DatePickerField({
    label,
    value,
    onChange,
    disabled = false,
    error,
}: DatePickerFieldProps) {
    const selectedDate = value ? new Date(value) : undefined;

    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm font-medium text-gray-300">{label}</label>
            )}

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal border-gray-700 bg-black-500 hover:bg-gray-800",
                            !selectedDate && "text-muted-foreground"
                        )}
                        disabled={disabled}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "Pick a date"}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0 bg-black-500 border-gray-700">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(d) => d && onChange(format(d, "yyyy-MM-dd"))}
                        disabled={disabled}
                    />
                </PopoverContent>
            </Popover>

            {error && (
                <p className="text-red-500 text-xs mt-1">{error.message}</p>
            )}
        </div>
    );
}
