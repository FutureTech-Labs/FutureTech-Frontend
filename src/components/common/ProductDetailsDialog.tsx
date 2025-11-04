"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ProductDetailsDialogProps {
    product: IProduct | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ProductDetailsDialog = ({ product, open, onOpenChange }: ProductDetailsDialogProps) => {
    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">{product.name}</DialogTitle>
                    <DialogDescription>
                        Detailed information about the selected product.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    {/* Product Image */}
                    {product?.images && product.images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 ">
                            {product.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={`Product image ${i + 1}`}
                                    className="object-contain rounded"
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No images available</p>
                    )}


                    {/* Product Details */}
                    <div className="space-y-2 text-sm">
                        <p><strong>Brand:</strong> {(product.brand as any)?.name || "—"}</p>
                        <p><strong>Category:</strong> {(product.category as any)?.name || "—"}</p>
                        <p><strong>Price:</strong> Rs. {product.sellingPrice.toLocaleString()}</p>
                        <p><strong>Warranty:</strong> {product.warrantyPeriod}</p>
                        <p><strong>Status:</strong> {product.status}</p>
                        <p><strong>Created At:</strong> {new Date(product.createdAt).toLocaleDateString("en-GB")}</p>
                    </div>

                    {/* Description Section */}
                    {product.description && (
                        <div className="mt-3">
                            <p className="font-semibold">Description</p>
                            <p className="text-gray-600 text-sm mt-1">{product.description.intro}</p>

                            {product.description.specifications && (
                                <ul className="list-disc ml-5 mt-2 text-sm text-gray-700">
                                    {product.description.specifications.map((spec, i) => (
                                        <li key={i}>{spec}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductDetailsDialog;
