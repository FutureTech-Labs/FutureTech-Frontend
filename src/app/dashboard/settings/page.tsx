"use client";

import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { EdgeStoreUploader } from "@/components/common/EdgeStoreUploader";

export default function EdgeStoreUploaderForm() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

    const { edgestore } = useEdgeStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !price) return alert("Fill all fields!");
        if (selectedFiles.length === 0) return alert("Select images!");

        setUploading(true);
        try {
            const urls: string[] = [];
            for (const file of selectedFiles) {
                const res = await edgestore.productImages.upload({ file });
                urls.push(res.url);
            }
            setUploadedUrls(urls);

            console.log({ name, price, images: urls });
            alert("Product submitted!");
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-3xl mx-auto p-6 bg-gray-900 rounded-xl"
        >
            <h2 className="text-2xl font-bold text-white">Add Product</h2>

            <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md p-2 bg-gray-800 text-white"
            />
            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="block w-full rounded-md p-2 bg-gray-800 text-white"
            />

            {/* Reusable uploader */}
            <EdgeStoreUploader
                maxFiles={4}
                onFilesChange={(files: File[]) => setSelectedFiles(files)}
            />

            <button
                type="submit"
                disabled={uploading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mt-4"
            >
                {uploading ? "Uploading..." : "Submit"}
            </button>
        </form>
    );
}
