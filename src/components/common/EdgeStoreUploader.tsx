"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import React, { useState, useRef, useEffect } from "react";
import { Image as ImageIcon } from "lucide-react";

interface EdgeStoreUploaderProps {
    maxFiles?: number;
    maxSizeMB?: number;
    onFilesChange: (files: File[], urls: string[]) => void;
    initialUrls?: string[]; // existing image URLs for edit mode
}

export const EdgeStoreUploader: React.FC<EdgeStoreUploaderProps> = ({
    maxFiles = 4,
    maxSizeMB = 4,
    onFilesChange,
    initialUrls = [],
}) => {
    const [fileSlots, setFileSlots] = useState<(File | string | null)[]>(
        Array(maxFiles).fill(null)
    );
    const [errors, setErrors] = useState<(string | null)[]>(Array(maxFiles).fill(null));

    const multiInputRef = useRef<HTMLInputElement>(null);

    // 🧠 Load existing images (for edit)
    useEffect(() => {
        if (initialUrls.length > 0) {
            const filled = Array(maxFiles)
                .fill(null)
                .map((_, i) => initialUrls[i] || null);
            setFileSlots(filled);
        }
    }, [initialUrls, maxFiles]);

    // ✅ Handle multiple files at once
    const handleMultipleFileSelect = (files: FileList) => {
        const validFiles = Array.from(files).slice(0, maxFiles);
        const newSlots = [...fileSlots];
        const newErrors = [...errors];

        validFiles.forEach((file) => {
            const emptyIndex = newSlots.findIndex((f) => f === null);
            if (emptyIndex !== -1) {
                const sizeMB = file.size / (1024 * 1024);
                if (sizeMB > maxSizeMB) {
                    newErrors[emptyIndex] = `File exceeds ${maxSizeMB} MB limit.`;
                } else {
                    newErrors[emptyIndex] = null;
                    newSlots[emptyIndex] = file;
                }
            }
        });

        setErrors(newErrors);
        setFileSlots(newSlots);
        emitChanges(newSlots);
    };

    // ✅ Handle single file replace
    const handleSingleFileChange = (index: number, file: File | null) => {
        const newSlots = [...fileSlots];
        const newErrors = [...errors];

        if (file) {
            const sizeMB = file.size / (1024 * 1024);
            if (sizeMB > maxSizeMB) {
                newErrors[index] = `File exceeds ${maxSizeMB} MB limit.`;
                newSlots[index] = null;
            } else {
                newErrors[index] = null;
                newSlots[index] = file;
            }
        } else {
            newErrors[index] = null;
            newSlots[index] = null;
        }

        setErrors(newErrors);
        setFileSlots(newSlots);
        emitChanges(newSlots);
    };

    // ✅ Remove file or URL
    const handleRemove = (index: number) => {
        const newSlots = [...fileSlots];
        newSlots[index] = null;
        setFileSlots(newSlots);
        emitChanges(newSlots);
    };

    // Helper to emit current state
    const emitChanges = (slots: (File | string | null)[]) => {
        const files = slots.filter((f) => f instanceof File) as File[];
        const urls = slots.filter((f) => typeof f === "string") as string[];
        onFilesChange(files, urls);
    };

    return (
        <div className="w-full space-y-3">
            <div>
                <h3 className="text-sm font-semibold text-gray-200">Product Images</h3>
                <p className="text-xs text-blue-400 mt-1">
                    Note: PNG, JPG, SVG, WEBP (max {maxSizeMB} MB each)
                </p>
            </div>

            {/* Hidden multiple input */}
            <input
                type="file"
                accept="image/*"
                multiple
                ref={multiInputRef}
                className="hidden"
                onChange={(e) => e.target.files && handleMultipleFileSelect(e.target.files)}
            />

            <div className="grid md:grid-cols-4 gap-4 mt-3">
                {fileSlots.map((slot, index) => (
                    <div key={index} className="flex flex-col items-center w-full">
                        <div
                            className={cn(
                                "relative flex items-center justify-center border-2 border-dashed rounded-xl h-36 w-full cursor-pointer transition",
                                slot
                                    ? "border-blue-500 bg-blue-900/10 hover:opacity-90"
                                    : "border-blue-400/30 hover:border-blue-400"
                            )}
                            onClick={() => {
                                // 🧠 If there are empty slots, allow multi-select
                                const hasEmpty = fileSlots.some((f) => f === null);
                                if (hasEmpty) multiInputRef.current?.click();
                                else document.getElementById(`file-input-${index}`)?.click();
                            }}
                        >
                            {slot ? (
                                <>
                                    <Image
                                        src={
                                            typeof slot === "string"
                                                ? slot
                                                : URL.createObjectURL(slot as File)
                                        }
                                        alt={`Image ${index + 1}`}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(index);
                                        }}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        ✕
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <ImageIcon className="w-8 h-8 text-blue-400" />
                                    <p className="text-xs text-blue-300">Photo {index + 1}</p>
                                </div>
                            )}

                            {/* Per-box upload */}
                            <input
                                id={`file-input-${index}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                    handleSingleFileChange(index, e.target.files?.[0] || null)
                                }
                            />
                        </div>

                        {errors[index] && (
                            <p className="text-xs text-red-400 mt-1 text-center w-full">
                                {errors[index]}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
