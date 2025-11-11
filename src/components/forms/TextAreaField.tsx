import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

const TextareaField = ({
    name,
    label,
    placeholder,
    register,
    error,
    validation,
    disabled,
    value,
    rows = 4,
    maxWords,
}: IFormTextareaProps) => {
    const [wordCount, setWordCount] = useState(0);

    const countWords = (text: string) => {
        return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    };

    const handleWordCount = (text: string) => {
        setWordCount(countWords(text));
    };

    useEffect(() => {
        if (value) handleWordCount(value);
    }, [value]);

    // Extend validation for word limit
    const registerWithValidation = register(name, {
        ...validation,
        validate: {
            ...(validation?.validate || {}),
            wordLimit: (v: string) => {
                if (!maxWords) return true;
                const count = countWords(v);
                return count <= maxWords || `Maximum ${maxWords} words allowed`;
            },
        },
    });

    return (
        <div className="space-y-2">
            {label && (
                <Label htmlFor={name} className="text-sm font-medium text-gray-400">
                    {label}
                </Label>
            )}

            <Textarea
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                className={cn(
                    "text-white max-h-[200px]! overflow-y-auto text-base placeholder:text-gray-500 border-[0.3px] border-gray-500/20 backdrop-blur-2xl bg-gray-500/15! rounded-lg",
                    { 'opacity-50 cursor-not-allowed': disabled },
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                )}
                {...registerWithValidation}
                onChange={(e) => {
                    handleWordCount(e.target.value);
                    registerWithValidation.onChange(e);
                }}
            />

            <div className="flex justify-between text-xs text-gray-400">
                {error ? (
                    <p className="text-error-500">{error.message}</p>
                ) : (
                    <span className="invisible">placeholder</span>
                )}

                {maxWords && (
                    <p
                        className={cn(
                            "text-xs",
                            wordCount > maxWords
                                ? "text-error-500"
                                : wordCount > maxWords * 0.8
                                    ? "text-yellow-400"
                                    : "text-gray-500"
                        )}
                    >
                        {wordCount} / {maxWords} words
                    </p>
                )}
            </div>
        </div>
    );
};

export default TextareaField;
