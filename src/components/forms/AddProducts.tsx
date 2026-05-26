"use client";

import {
    useEffect,
    useState
} from "react";
import { toast } from "sonner";
import InputField from "./InputField";
import SelectField from "./SelectField";
import TextareaField from "./TextAreaField";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { EdgeStoreUploader } from "../common/EdgeStoreUploader";
import { PRODUCT_STATUSES, WARRANTY_PERIODS } from "@/constants";
import { createProduct, updateProduct } from "@/services/productService";

interface ProductFormProps {
    product?: IProduct | null;
    brands: Brand[];
    categories: Category[];
    onSuccess?: () => void;
    onCancel?: () => void;
}

interface ProductImage {
    url: string;
    public_id: string;
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
    images: (ProductImage | File)[];
    minStock: number;
}

const ProductForm = ({
    product,
    brands,
    categories,
    onSuccess,
    onCancel,
}: ProductFormProps) => {
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
            images: [],
            minStock: 5
        },
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            reset({
                name: product.name || "",
                category: product.category?._id || "",
                brand: product.brand?._id || "",
                sellingPrice: product.sellingPrice || 0,
                warrantyPeriod: product.warrantyPeriod || WARRANTY_PERIODS[0],
                intro: product.description?.intro || "",
                specifications:
                    product.description?.specifications?.join("\n") || "",
                status: product.status || PRODUCT_STATUSES[0],
                images: product.images || [],
                minStock: product.minStock ?? 5
            });
        } else {
            reset({
                name: "",
                category: "",
                brand: "",
                sellingPrice: 0,
                warrantyPeriod: WARRANTY_PERIODS[0],
                intro: "",
                specifications: "",
                status: PRODUCT_STATUSES[0],
                images: [],
                minStock: 5
            });
        }
    }, [product, reset]);

    const onSubmit = async (data: ProductFormValues) => {
        try {
            if (!data.images || data.images.length === 0) {
                toast.warning("Please upload at least one product image.");
                return;
            }

            setLoading(true);

            // Validate brand/category
            const selectedBrand = brands.find((b) => b._id === data.brand);
            const selectedCategory = categories.find((c) => c._id === data.category);

            if (!selectedBrand || !selectedCategory) {
                toast.error("Please select a valid brand and category.");
                return;
            }

            // Prepare description
            const description = {
                intro: data.intro,
                specifications: data.specifications
                    .split(/\r?\n|,|•|-/)
                    .map((s) => s.replace(/^(\s*[\u2022\-•]\s*)/, "").trim())
                    .filter(Boolean),
            };

            // Create FormData
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("brand", selectedBrand._id);
            formData.append("category", selectedCategory._id);
            formData.append("sellingPrice", data.sellingPrice.toString());
            formData.append("warrantyPeriod", data.warrantyPeriod);
            formData.append("status", data.status);
            formData.append("minStock", data.minStock.toString());

            // Description fields
            formData.append("description[intro]", description.intro);

            description.specifications.forEach((spec) => {
                formData.append("description[specifications][]", spec);
            });

            data.images.forEach((image) => {

                // Existing image
                if (
                    typeof image === "object" &&
                    image !== null &&
                    "url" in image
                ) {

                    formData.append(
                        "existingImages",
                        JSON.stringify(image)
                    );

                }

                // Newly uploaded file
                if (image instanceof File) {

                    formData.append(
                        "newImages",
                        image
                    );
                }
            });

            // Create or update product
            if (product?._id) {
                await updateProduct(product._id, formData as any);
                toast.success("Product updated successfully!");
            } else {
                await createProduct(formData);
                toast.success("Product added successfully!");
            }

            reset();
            onSuccess?.();

        } catch (error: any) {

            // Field error mapping
            const msg = (error?.response?.data?.message || "").toLowerCase();

            const fieldMap: Record<string, keyof ProductFormValues> = {
                name: "name",
                category: "category",
                brand: "brand",
                price: "sellingPrice",
            };

            const matchedKey = Object.keys(fieldMap).find((key) =>
                msg.includes(key)
            );

            if (matchedKey) {
                setError(fieldMap[matchedKey], {
                    type: "server",
                    message:
                        error.response?.data?.message || "Invalid field value.",
                });
            } else {
                toast.error(
                    error.response?.data?.message || "Failed to save product."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={loading} className={`space-y-4 ${loading ? "pointer-events-none" : ""}`}>
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
                <div className="flex flex-col md:flex-row gap-4">
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
                </div>
                {/* Intro */}
                <TextareaField
                    name="intro"
                    label="Description"
                    placeholder="Short description about the product"
                    register={register}
                    error={errors.intro}
                    validation={{ required: "Description is required" }}
                    maxWords={100}
                />
                {/* Specifications */}
                <TextareaField
                    name="specifications"
                    label="Specifications"
                    placeholder="Enter specifications (each line = one item)"
                    register={register}
                    error={errors.specifications}
                    validation={{ required: "At least one specification is required" }}
                    maxWords={100}
                />
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
                {/* Images */}
                <Controller
                    name="images"
                    control={control}
                    rules={{
                        validate: (value) =>
                            value && value.length > 0
                                ? true
                                : "Please upload at least one product image.",
                    }}
                    render={({ field, fieldState }) => (
                        <EdgeStoreUploader
                            maxFiles={4}
                            value={field.value}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                            initialUrls={product?.images || []}
                        />
                    )}
                />
                {/* Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <InputField
                        name="minStock"
                        label="Minimum Stock Threshold"
                        type="number"
                        placeholder="Enter minimum stock for alerts"
                        register={register}
                        error={errors.minStock}
                        validation={{
                            required: "Minimum stock is required",
                            min: { value: 0, message: "Cannot be negative" }
                        }}
                    />

                </div>
                {/* Footer Buttons */}
                <div className="sticky -bottom-px bg-black-500 flex gap-3 py-3 border-t border-gray-800">
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
                        {loading
                            ? product
                                ? "Updating..."
                                : "Saving..."
                            : product
                                ? "Update Product"
                                : "Save Product"}
                    </Button>
                </div>
            </fieldset>
        </form>
    );
};

export default ProductForm;
