"use client";

import {
    useEffect,
    useState
} from "react";
import {
    useForm,
    useFieldArray
} from "react-hook-form";

import { toast } from "sonner";

import InputField from "./InputField";
import SelectField from "./SelectField";
import ComboBoxField from "./ComboField";
import { CircleMinus } from "lucide-react";
import IconButton from "../common/IconButton";
import { Button } from "@/components/ui/button";

import { getProducts } from "@/services/productService";
import { getSuppliers } from "@/services/supplierServices";
import { createPurchase } from "@/services/purchaseService";

interface PurchaseFormProps {
    onSuccess?: (data: IPurchaseCreateResponse) => void;
    onCancel?: () => void;
}

interface PurchaseFormValues {
    supplier: string;
    paymentType: "COD" | "Net 15" | "Net 30" | "Net 45";
    items: {
        product: string;
        quantity: number;
        costPrice: number;
        warrantyReference?: string;
    }[];
}

const PurchaseForm = ({ onSuccess, onCancel }: PurchaseFormProps) => {
    const [loading, setLoading] = useState(false);
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
    const [products, setProducts] = useState<IProduct[]>([]);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<PurchaseFormValues>({
        defaultValues: {
            supplier: "",
            paymentType: "COD",
            items: [
                { product: "", quantity: 1, costPrice: 0, warrantyReference: "" },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const itemsWatch = watch("items");

    const totalAmount = itemsWatch.reduce(
        (sum, item) => sum + (item.quantity || 0) * (item.costPrice || 0),
        0
    );

    // Fetch suppliers & products
    useEffect(() => {
        (async () => {
            try {
                const s = await getSuppliers({ limit: 200 });
                const p = await getProducts({ limit: 200 });

                if (s.success) setSuppliers(s.suppliers);
                if (p.success) setProducts(p.products);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const getProductSellingPrice = (productId: string) => {
        const found = products.find((p) => p._id === productId);
        return found ? found.sellingPrice : "";
    };

    const onSubmit = async (data: PurchaseFormValues) => {
        try {
            setLoading(true);

            const payload = {
                ...data,
                date: new Date().toISOString(),
            };

            const response = await createPurchase(payload);

            toast.success("Purchase successfull!");
            onSuccess?.(response);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error creating purchase");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Supplier */}
                <ComboBoxField
                    name="supplier"
                    control={control}
                    label="Supplier"
                    placeholder="Select supplier"
                    required
                    options={suppliers.map((s) => ({
                        value: s._id,
                        label: s.name,
                    }))}
                    error={errors.supplier}
                />
                {/* Payment Type */}
                <SelectField
                    name="paymentType"
                    label="Payment Type"
                    control={control}
                    required
                    options={[
                        { value: "COD", label: "Cash On Delivery (COD)" },
                        { value: "Net 15", label: "Net 15" },
                        { value: "Net 30", label: "Net 30" },
                        { value: "Net 45", label: "Net 45" },
                    ]}
                    placeholder="Select payment type"
                    className="h-11!"
                />
            </div>

            {/* Purchase Items */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Purchased Items</h3>

                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="relative grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-zinc-900/30 rounded-xl border border-zinc-700 shadow-sm"
                    >
                        {/* Product */}
                        <ComboBoxField
                            label="Product"
                            placeholder="Select product"
                            control={control}
                            name={`items.${index}.product`}
                            required
                            options={products.map((p) => ({
                                value: p._id,
                                label: p.name,
                            }))}
                            error={errors.items?.[index]?.product}
                            className="w-full"
                        />

                        {/* Quantity */}
                        {/* Quantity */}
                        <InputField
                            placeholder="Qty"
                            name={`items.${index}.quantity`}
                            label="Qty"
                            type="number"
                            register={register}                    // <-- IMPORTANT FIX
                            validation={{                          // <-- validation moved here
                                valueAsNumber: true,               // <-- number conversion
                                required: "Quantity required",
                                min: { value: 1, message: "Minimum 1 qty" },
                            }}
                            error={errors.items?.[index]?.quantity}
                            height="h-11"
                        />


                        {/* Selling price readonly */}
                        <InputField
                            placeholder="Selling Price"
                            label="Selling Price"
                            type="text"
                            name={`items.${index}.sellingPriceReadOnly`}
                            register={register}
                            validation={{}}
                            value={String(getProductSellingPrice(itemsWatch[index]?.product))}
                            readonly
                            height="h-11"
                            error={undefined}
                        />

                        {/* Cost Price */}
                        {/* Cost Price */}
                        <InputField
                            placeholder="Cost Price"
                            name={`items.${index}.costPrice`}
                            label="Cost Price"
                            type="number"
                            register={register}
                            validation={{
                                valueAsNumber: true,
                                required: "Cost price required",
                                min: { value: 0, message: "Cannot be negative" },
                            }}
                            error={errors.items?.[index]?.costPrice}
                            height="h-11"
                        />


                        {/* Remove */}
                        <div className="absolute top-0 right-0 flex items-end">
                            {index > 0 && (
                                <IconButton
                                    icon={CircleMinus}
                                    iconColor="text-red-400"
                                    size="lg"
                                    onClick={() => remove(index)}
                                />
                            )}
                        </div>
                    </div>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    className="main-button-gradient"
                    onClick={() => {
                        const lastIndex = itemsWatch.length - 1;

                        if (!itemsWatch[lastIndex].product) {
                            toast.error("Please select a product before adding a new item.");
                            return;
                        }

                        append({
                            product: "",
                            quantity: 1,
                            costPrice: 0,
                            warrantyReference: "",
                        });
                    }}
                >
                    Add Another Item
                </Button>

            </div>

            {/* Total */}
            <div className="flex justify-between text-xl font-semibold text-gray-300">
                <span>Total Amount:</span>
                <span>LKR {totalAmount.toLocaleString()}</span>
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                    {loading ? "Purchasing..." : "Purchase"}
                </Button>
            </div>
        </form>
    );
};

export default PurchaseForm;
