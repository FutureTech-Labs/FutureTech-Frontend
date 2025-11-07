"use client";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownFieldProps<T extends Record<string, any>> {
    label?: string;
    items: T[];
    valueKey?: keyof T;
    labelKey?: keyof T;
    placeholder?: string;
    selected?: string;
    onChange: (value: string) => void;
    className?: string;
}

const DropdownField = <T extends Record<string, any>>({
    label,
    items,
    valueKey,
    labelKey,
    placeholder = "Select an option",
    selected,
    onChange,
    className,
}: DropdownFieldProps<T>) => {
    const vKey = (valueKey ?? "_id") as keyof T;
    const lKey = (labelKey ?? "name") as keyof T;

    const selectedLabel =
        items.find((item) => String(item[vKey]) === selected)?.[lKey] ??
        placeholder;

    return (
        <div className={cn("flex flex-col gap-1 w-full md:max-w-3xs", className)}>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="flex justify-between items-center"
                    >
                        {String(selectedLabel)}
                        <ChevronDown className="w-4 h-4 opacity-70" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-[200px]">
                    <DropdownMenuItem onClick={() => onChange("all")}>
                        All
                    </DropdownMenuItem>
                    {items.map((item, i) => (
                        <DropdownMenuItem
                            key={i}
                            onClick={() => onChange(String(item[vKey]))}
                        >
                            {String(item[lKey])}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default DropdownField;
