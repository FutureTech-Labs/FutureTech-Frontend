"use client";

import {
    useEffect,
    useState
} from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import IconButton from "../common/IconButton";

export interface SearchFieldProps {
    value?: string;
    onChange: (value: string) => void;
    onClear?: () => void;
    placeholder?: string;
    className?: string;
    debounceDelay?: number;
    autoFocus?: boolean;
}

const SearchField = ({
    value = "",
    onChange,
    onClear,
    placeholder = "Search...",
    className,
    debounceDelay = 800,
    autoFocus = false,
}: SearchFieldProps) => {
    const [inputValue, setInputValue] = useState(value);

    // Sync parent changes to input
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            onChange(inputValue.trim());
        }, debounceDelay);

        return () => clearTimeout(handler);
    }, [inputValue, debounceDelay, onChange]);

    // Handle clear
    const handleClear = () => {
        setInputValue("");
        onClear?.();
        onChange("");
    };

    return (
        <div
            className={cn(
                "relative flex items-center w-full text-xs md:text-sm text-white",
                className
            )}
        >

            <Input
                type="text"
                autoFocus={autoFocus}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") handleClear();
                }}
                placeholder={placeholder}
                className="pl-3 pr-9 disable-rings search-gradient rounded-lg! h-11 focus:ring-1! focus:ring-primary-800! placeholder:text-secondary-100/80 truncate text-xs md:text-sm shadow-lg shadow-primary-900/25"
            />


            {inputValue ? (
                <IconButton
                    onClick={handleClear}
                    className="absolute right-2 p-1"
                    ariaLabel="Clear search"
                    icon={X}
                />
            ) : (
                <Image
                    src="/icons/Search.svg"
                    alt="search"
                    width={16}
                    height={16}
                    className="absolute right-4"
                />
            )}
        </div>
    );
};

export default SearchField;