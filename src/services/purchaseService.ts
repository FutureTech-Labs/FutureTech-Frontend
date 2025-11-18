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

// CREATE PURCHASE
export const createPurchase = async (
    payload: CreatePurchasePayload
): Promise<IPurchaseCreateResponse> => {
    const res = await api.post("/admin/purchase", payload);
    return res.data;
};

// GET PURCHASE INVOICES
export const getPurchaseInvoice = async (
    invoiceId: string
): Promise<IPurchaseInvoiceResponse> => {
    const res = await api.get(`/admin/purchase/invoice/${invoiceId}`);
    return res.data;
};