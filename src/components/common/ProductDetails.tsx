import ThumbSlider from "../sliders/ThumbSlider";

interface ProductDetailsDialogProps {
    product: IProduct | null;
}

const ProductDetails = ({ product }: ProductDetailsDialogProps) => {
    if (!product) return null;
    return (
        <div className="flex flex-col space-y-4 w-full min-w-0">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 h-full lg:h-64">

                <div className="lg:col-span-7">
                    <ThumbSlider images={product.images} name={product.name} />
                </div>


                {/* Product Details */}
                <div className="lg:col-span-5 h-full flex flex-col justify-between text-sm border border-white rounded-lg p-3">

                    {/* Top Section (Name + Category) */}
                    <div className="pb-2 border-b border-gray-500">
                        <p className="text-base font-semibold">{product.name}</p>
                        <p className="text-gray-400">
                            {(product.category)?.name || "—"}
                        </p>
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 flex flex-col justify-evenly mt-2">
                        <p><strong>Brand:</strong> {(product.brand as any)?.name || "—"}</p>
                        <p><strong>Price:</strong> Rs. {product.sellingPrice.toLocaleString()}</p>
                        <p><strong>Warranty:</strong> {product.warrantyPeriod || "—"}</p>
                        <p><strong>Status:</strong> {product.status || "—"}</p>
                        <p><strong>Created At:</strong> {new Date(product.createdAt).toLocaleDateString("en-GB")}</p>
                    </div>
                </div>
            </div>


            {/* Description Section */}
            {product.description && (
                <div className="mt-3">
                    <p className="font-semibold">Description</p>
                    {product.description.intro && (
                        <p className="text-sm mt-1">{product.description.intro}</p>
                    )}

                    {product.description.specifications && product.description.specifications.length > 0 && (
                        <ul className="list-disc ml-5 mt-2 text-sm">
                            {product.description.specifications.map((spec, i) => (
                                <li key={i}>{spec}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}

export default ProductDetails