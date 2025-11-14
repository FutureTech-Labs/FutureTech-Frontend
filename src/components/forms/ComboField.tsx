"use client";

import {
    Combobox,
    ComboboxInput,
    ComboboxButton,
    ComboboxOptions,
    ComboboxOption,
} from "@headlessui/react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Controller } from "react-hook-form";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface Option {
    value: string;
    label: string;
}

interface Props {
    name?: string;
    control?: any;
    label?: string;
    options: Option[];
    placeholder?: string;
    required?: boolean;
    value?: string;
    onChange?: (val: string) => void;
    disabled?: boolean;
    className?: string;
    error?: any;
}

export default function ComboBoxField({
    name,
    control,
    label,
    options,
    placeholder = "Select...",
    required = false,
    value,
    onChange,
    disabled = false,
    className,
    error,
}: Props) {
    const [query, setQuery] = useState("");

    // FILTER OPTIONS LIKE SHADCN COMBOBOX
    const filteredOptions = useMemo(() => {
        if (!query.trim()) return options;
        return options.filter((o) =>
            o.label.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, options]);

    const renderCombo = (
        selected: string | undefined,
        setSelected: (value: string) => void
    ) => {
        return (
            <div className={cn("w-full", className)}>
                <Combobox
                    value={selected ?? ""}
                    onChange={(v: string | null) => setSelected(v ?? "")}
                >
                    <div className="relative">
                        {/* INPUT */}
                        <div className="flex w-full h-full items-center">
                            <ComboboxInput
                                className={cn(
                                    "w-full rounded-md border border-gray-700 bg-transparent px-3 text-sm outline-none focus:ring-1 h-11",
                                    disabled && "opacity-60 cursor-not-allowed"
                                )}
                                placeholder={placeholder}
                                // IMPORTANT: capture search text
                                onChange={(event) => setQuery(event.target.value)}
                                displayValue={(value: string) =>
                                    options.find((o) => o.value === value)?.label || ""
                                }
                            />

                            <ComboboxButton className="absolute right-2 top-3.5">
                                <ChevronsUpDown className="h-4 w-4 opacity-60" />
                            </ComboboxButton>
                        </div>

                        {/* OPTIONS */}
                        <ComboboxOptions className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-gray-700 bg-trabs py-1 shadow-xl focus:outline-none">
                            {filteredOptions.length === 0 && (
                                <div className="px-3 py-2 text-sm text-gray-400">
                                    No results found
                                </div>
                            )}

                            {filteredOptions.map((o) => (
                                <ComboboxOption
                                    key={o.value}
                                    value={o.value}
                                    className={({ active }) =>
                                        cn(
                                            "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
                                            active ? "bg-gray-800" : "bg-black-500"
                                        )
                                    }
                                >
                                    {({ selected }) => (
                                        <>
                                            <span className="flex-1 truncate">{o.label}</span>
                                            {selected && (
                                                <Check className="h-4 w-4 text-blue-400" />
                                            )}
                                        </>
                                    )}
                                </ComboboxOption>
                            ))}
                        </ComboboxOptions>
                    </div>
                </Combobox>
            </div>
        );
    };

    // RHF MODE
    if (control && name) {
        return (
            <div className="w-full">
                {label && (
                    <Label className="mb-2 block text-sm font-medium text-gray-300">
                        {label}
                    </Label>
                )}

                <Controller
                    name={name}
                    control={control}
                    rules={{
                        required: required ? `${label} is required` : false,
                    }}
                    render={({ field }) => (
                        <>
                            {renderCombo(field.value, field.onChange)}

                            {error && (
                                <p className="text-sm text-error-500 mt-1">
                                    {error.message}
                                </p>
                            )}
                        </>
                    )}
                />
            </div>
        );
    }

    // STANDALONE MODE
    return (
        <div className="w-full">
            {label && (
                <Label className="mb-2 block text-sm font-medium text-gray-300">
                    {label}
                </Label>
            )}

            {renderCombo(value, onChange ?? (() => { }))}

            {error && (
                <p className="text-sm text-error-500 mt-1">{error.message}</p>
            )}
        </div>
    );
}
