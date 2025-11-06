"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

interface EdgeStoreUploaderProps {
    maxFiles?: number;
    onFilesChange: (files: File[]) => void;
}

export const EdgeStoreUploader: React.FC<EdgeStoreUploaderProps> = ({
    maxFiles = 4,
    onFilesChange,
}) => {
    const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>(
        Array(maxFiles).fill(null)
    );

    const handleFileChange = (index: number, file: File | null) => {
        const newFiles = [...selectedFiles];
        newFiles[index] = file;
        setSelectedFiles(newFiles);
        onFilesChange(newFiles.filter(Boolean) as File[]);
    };

    const handleRemove = (index: number) => {
        const newFiles = [...selectedFiles];
        newFiles[index] = null;
        setSelectedFiles(newFiles);
        onFilesChange(newFiles.filter(Boolean) as File[]);
    };

    return (
        <div className="w-full space-y-3">
            <div>
                <h3 className="text-sm font-semibold text-gray-200">Product Images</h3>
                <p className="text-xs text-blue-400 mt-1">
                    Note: Format photos SVG, PNG, or JPG (Max size 4MB)
                </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mt-3">
                {selectedFiles.map((file, index) => (
                    <div
                        key={index}
                        className={cn(
                            "relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-2 h-36 cursor-pointer transition",
                            file
                                ? "border-blue-500 bg-blue-900/10 hover:opacity-90"
                                : "border-blue-400/30 hover:border-blue-400"
                        )}
                    >
                        {file ? (
                            <>
                                <Image
                                    src={URL.createObjectURL(file)}
                                    alt={`Photo ${index + 1}`}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    ×
                                </button>
                            </>
                        ) : (
                            <label className="flex flex-col items-center justify-center gap-2 w-full h-full">
                                <ImageIcon className="w-8 h-8 text-blue-400" />
                                <p className="text-xs text-blue-300">Photo {index + 1}</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        handleFileChange(index, e.target.files?.[0] || null)
                                    }
                                />
                            </label>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
