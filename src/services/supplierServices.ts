import api from "@/lib/api";

interface GetSuppliersParams {
    search?: string;
    status?: "paid" | "pending";
    supplierStatus?: "active" | "inactive" | "all";
    minBalance?: number;
    maxBalance?: number;
    page?: number;
    limit?: number;
}

// Get all suppliers (Admin only)
export const getSuppliers = async (
    params?: GetSuppliersParams
): Promise<{
    success: boolean;
    total: number;
    page: number;
    pages: number;
    count: number;
    suppliers: ISupplier[];
}> => {
    const res = await api.get(`/admin/suppliers`, { params });
    return res.data;
};

// Get single supplier by ID (Admin only)
export const getSupplierById = async (id: string): Promise<ISupplier> => {
    const res = await api.get<{ success: boolean; supplier: ISupplier }>(`/admin/supplier/${id}`);
    return res.data.supplier;
};

// Create new supplier (Admin only)
export const createSupplier = async (supplierData: Partial<ISupplier>): Promise<ISupplier> => {
    const res = await api.post<{ success: boolean; message: string; supplier: ISupplier }>(`/admin/supplier`, supplierData);
    return res.data.supplier;
};

// Update supplier (Admin only)
export const updateSupplier = async (id: string, supplierData: Partial<ISupplier>): Promise<ISupplier> => {
    const res = await api.put<{ success: boolean; message: string; supplier: ISupplier }>(`/admin/supplier/${id}`, supplierData);
    return res.data.supplier;
};

// Deactivate supplier (Admin only)
export const toggleSupplierStatus = async (
    id: string
): Promise<{ success: boolean; message: string }> => {
    const res = await api.patch<{ success: boolean; message: string }>(`/admin/supplier/toggle/${id}`);
    return res.data;
};