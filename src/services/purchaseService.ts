import api from "@/lib/api";

export interface PurchaseItemPayload {
    product: string;
    costPrice: number;
    quantity: number;
    warrantyReference?: string | null;
}

export interface CreatePurchasePayload {
    supplier: string;
    paymentType?: "COD" | "Net 15" | "Net 30" | "Net 45";
    items: PurchaseItemPayload[];
    date?: string;
}

export const createPurchase = async (payload: CreatePurchasePayload) => {
    const res = await api.post("/admin/purchase", payload);
    return res.data; // invoice + batches
};
