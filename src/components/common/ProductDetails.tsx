import ThumbSlider from "../sliders/ThumbSlider";
import { formatCurrencyLKR, toSentenceCase } from "@/lib/utils";

interface ProductDetailsDialogProps {
    product: IProduct | null;
}

const ProductDetails = ({ product }: ProductDetailsDialogProps) => {
    if (!product) return null;
    return (
        <div className="flex flex-col space-y-4 w-full min-w-0 pb-5">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 h-full lg:h-64">

                {/* Image slider */}
                <div className="lg:col-span-7">
                    <ThumbSlider images={product.images} name={product.name} />
                </div>

                {/* Product Details */}
                <div className="lg:col-span-5 h-full flex flex-col justify-between text-sm border-gradient-2 rounded-lg px-3 pt-3">

                    {/* Top Section (Name + Category) */}
                    <div className="pb-2 border-b border-gray-500">
                        <p className="text-base font-semibold">{product.name}</p>
                        <p className="text-gray-400">
                            {(product.category)?.name || "—"}
                        </p>
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 flex flex-col my-2 gap-1 justify-evenly">
                        <Field label="Brand" value={(product.brand)?.name || "—"} />
                        <Field label="Price" value={formatCurrencyLKR(product.sellingPrice, false) || "—"} accent />
                        <Field label="Total Stock" value={(product.totalStock) || 0} />
                        <Field label="Min Stock Threshold" value={(product.minStock) || 0} />
                        <Field label="Warranty Peroid" value={(product.warrantyPeriod) || "—"} />
                        <Field label="Status" value={toSentenceCase(product.status) || "-"} />
                    </div>
                </div>
            </div>

            {/* Description Section */}
            {product.description && (
                <div className="flex flex-col md:gap-3 gap-2">
                    <p className="font-semibold">Description</p>
                    {product.description.intro && (
                        <p className="text-sm text-justify">{product.description.intro}</p>
                    )}

                    <p className="font-semibold mt-3">Specifications</p>
                    {product.description.specifications && product.description.specifications.length > 0 && (
                        <ul className="list-disc ml-5 text-sm space-y-2">
                            {product.description.specifications.map((spec, i) => (
                                <li key={i}>{spec}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Product added date */}
            <div className="hidden lg:block absolute bottom-3 right-5 text-sm">
                <Field label="Created at:" value={new Date(product.createdAt).toLocaleDateString("en-GB")} />
            </div>
        </div>
    )
}

export default ProductDetails;

function Field({
    label,
    value,
    accent = false,
}: {
    label: string;
    value: string | number;
    accent?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span>{label}</span>
            <span className={accent ? "text-emerald-300 font-semibold" : "text-white"}>
                {value}
            </span>
        </div>
    );
}