import api from "@/lib/api";

interface SupplierPaymentAllocation {
    invoice: string;
    amount: number;
}

interface CreateSupplierPaymentPayload {
    amount: number;
    paymentMethod: "cash" | "online_transfer";
    notes?: string;
    appliedInvoices?: SupplierPaymentAllocation[];
}

export const createSupplierPayment = async (
    supplierId: string,
    payload: CreateSupplierPaymentPayload
) => {
    const res = await api.post(`/admin/supplier/${supplierId}/pay`, payload);
    return res.data;
};
