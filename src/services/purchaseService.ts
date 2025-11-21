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

// GET A PURCHASE INVOICE
export const getPurchaseInvoice = async (
    invoiceId: string
): Promise<IPurchaseInvoiceResponse> => {
    const res = await api.get(`/admin/purchase/invoice/${invoiceId}`);
    return res.data;
};

// GET ALL PURCHASE INVOICES
export const getAllPurchases = async (params?: {
    page?: number;
    limit?: number;
    from?: string;
    to?: string;
    invoiceNumber?: string;
}): Promise<{
    success: boolean;
    data: IPurchaseInvoice[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
}> => {
    const res = await api.get(`/admin/purchase/invoices`, {
        params,
    });
    return res.data;
};