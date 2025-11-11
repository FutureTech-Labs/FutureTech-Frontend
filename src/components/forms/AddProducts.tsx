"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useEdgeStore } from "@/lib/edgestore";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/services/productService";
import { EdgeStoreUploader } from "../common/EdgeStoreUploader";
import { PRODUCT_STATUSES, WARRANTY_PERIODS } from "@/constants";

import InputField from "./InputField";
import SelectField from "./SelectField";
import TextareaField from "./TextAreaField";

interface AddProductsProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    brands: Brand[];
    categories: Category[];
    products: IProduct[];
}

interface ProductFormValues {
    name: string;
    category: string;
    brand: string;
    sellingPrice: number;
    warrantyPeriod: string;
    intro: string;
    specifications: string;
    status: string;
}

const AddProducts = ({ onSuccess, onCancel, brands, categories }: AddProductsProps) => {
    const {
        register,
        handleSubmit,
        control,
        reset,
        setError,
        formState: { errors },
    } = useForm<ProductFormValues>({
        defaultValues: {
            name: "",
            category: "",
            brand: "",
            sellingPrice: 0,
            warrantyPeriod: WARRANTY_PERIODS[0],
            intro: "",
            specifications: "",
            status: PRODUCT_STATUSES[0],
        },
        mode: "onSubmit",
    });

    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const { edgestore } = useEdgeStore();

    const onSubmit = async (data: ProductFormValues) => {
        try {
            if (images.length === 0) {
                toast.warning("Please upload at least one product image.");
                return;
            }

            setLoading(true);

            const uploadedImageUrls: string[] = [];
            for (const file of images) {
                const res = await edgestore.productImages.upload({
                    file,
                    onProgressChange: (p) => console.log("Uploading:", p + "%"),
                });
                if (res?.url) uploadedImageUrls.push(res.url);
            }

            if (uploadedImageUrls.length === 0) {
                toast.error("No image URLs received from EdgeStore.");
                return;
            }

            const selectedBrand = brands.find((b) => b._id === data.brand);
            const selectedCategory = categories.find((c) => c._id === data.category);

            if (!selectedBrand || !selectedCategory) {
                toast.error("Please select a valid brand and category.");
                return;
            }

            const description = {
                intro: data.intro,
                specifications: data.specifications
                    .split(/\r?\n|,|•|-/)
                    .map((s) => s.replace(/^(\s*[\u2022\-•]\s*)/, "").trim())
                    .filter(Boolean),
            };

            const payload: Partial<IProduct> = {
                name: data.name,
                brand: { _id: selectedBrand._id, name: selectedBrand.name },
                category: { _id: selectedCategory._id, name: selectedCategory.name },
                sellingPrice: Number(data.sellingPrice),
                warrantyPeriod: data.warrantyPeriod,
                description,
                images: uploadedImageUrls,
                status: data.status,
            };

            const product = await createProduct(payload);
            if (product) {
                toast.success("Product added successfully!");
                reset();
                setImages([]);
                onSuccess?.();
            }
        } catch (error: any) {
            console.error("Create product error:", error);

            const msg = error?.response?.data?.message?.toString().toLowerCase().trim();

            // Server-side field-specific error handling
            if (msg?.includes("name")) {
                setError("name", { type: "server", message: error.response.data.message });
            } else if (msg?.includes("category")) {
                setError("category", { type: "server", message: error.response.data.message });
            } else if (msg?.includes("brand")) {
                setError("brand", { type: "server", message: error.response.data.message });
            } else if (msg?.includes("price")) {
                setError("sellingPrice", { type: "server", message: error.response.data.message });
            } else if (msg?.includes("intro")) {
                setError("intro", { type: "server", message: error.response.data.message });
            } else if (msg?.includes("specification")) {
                setError("specifications", { type: "server", message: error.response.data.message });
            } else {
                toast.error(error.response?.data?.message || "Failed to add product.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Product Name */}
            <InputField
                name="name"
                label="Product Name"
                placeholder="Enter product name"
                register={register}
                error={errors.name}
                validation={{ required: "Product name is required" }}
            />

            {/* Category & Brand */}
            <div className="flex flex-row gap-4">
                <SelectField
                    name="category"
                    label="Category"
                    placeholder="Select a category"
                    control={control}
                    options={categories.map((cat) => ({
                        value: cat._id,
                        label: cat.name,
                    }))}
                    error={errors.category}
                    required
                    className="h-12!"
                />

                <SelectField
                    name="brand"
                    label="Brand"
                    placeholder="Select a brand"
                    control={control}
                    options={brands.map((b) => ({
                        value: b._id,
                        label: b.name,
                    }))}
                    error={errors.brand}
                    required
                    className="h-12!"
                />
            </div>

            {/* Selling Price & Warranty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    name="sellingPrice"
                    label="Selling Price (LKR)"
                    type="number"
                    placeholder="Enter price"
                    register={register}
                    error={errors.sellingPrice}
                    validation={{
                        required: "Selling price is required",
                        min: { value: 0, message: "Price cannot be negative" },
                    }}
                />

                <SelectField
                    name="warrantyPeriod"
                    label="Warranty Period"
                    placeholder="Select warranty period"
                    control={control}
                    options={WARRANTY_PERIODS.map((option) => ({
                        value: option,
                        label: option,
                    }))}
                    className="h-12!"
                />
            </div>

            {/* Intro */}
            <TextareaField
                name="intro"
                label="Intro"
                placeholder="Short introduction about the product"
                register={register}
                error={errors.intro}
                validation={{ required: "Intro is required" }}
                maxWords={100}
            />

            {/* Specifications */}
            <TextareaField
                name="specifications"
                label="Specifications"
                placeholder="Enter specifications"
                register={register}
                error={errors.specifications}
                validation={{ required: "At least one specification is required" }}
                maxWords={100}
            />

            {/* Product Images */}
            <EdgeStoreUploader maxFiles={4} onFilesChange={setImages} />

            {/* Status */}
            <SelectField
                name="status"
                label="Status"
                placeholder="Select status"
                control={control}
                options={PRODUCT_STATUSES.map((option) => ({
                    value: option,
                    label: option.charAt(0).toUpperCase() + option.slice(1),
                }))}
                className="h-12!"
            />

            {/* Footer Buttons */}
            <div className="sticky bottom-0 flex bg-black-500 gap-3 py-4 border-t border-gray-800 w-full">
                <Button
                    type="button"
                    onClick={onCancel}
                    variant="outline"
                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                    {loading ? "Saving..." : "Save Product"}
                </Button>
            </div>
        </form>
    );
};

export default AddProducts;
