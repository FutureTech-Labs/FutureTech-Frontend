import api from "@/lib/api";

interface GetProductsParams {
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    warranty?: string;
    status?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
}

// Get all categories and brands (accessible by admin & cashier)
export const getCategoriesAndBrands = async (): Promise<{
    success: boolean;
    categories: Category[];
    brands: Brand[];
}> => {
    const res = await api.get("/shared/categories-brands");
    return res.data;
};

// Get all products (accessible by admin & cashier)
export const getProducts = async (params?: GetProductsParams): Promise<{
    success: boolean;
    total: number;
    page: number;
    totalPages: number;
    products: IProduct[];
}> => {
    const res = await api.get("/shared/products", { params });
    return res.data;
};

// Get single product by ID (accessible by admin & cashier)
export const getProductById = async (id: string): Promise<IProduct> => {
    const res = await api.get<{ success: boolean; product: IProduct }>(`/shared/products/${id}`);
    return res.data.product;
};

// Create new product (Admin only)
export const createProduct = async (productData: Partial<IProduct>): Promise<IProduct> => {
    const res = await api.post<{ success: boolean; message: string; product: IProduct }>("/admin/product", productData);
    return res.data.product;
};

// Update product (Admin only)
export const updateProduct = async (id: string, productData: Partial<IProduct>): Promise<IProduct> => {
    const res = await api.put<{ success: boolean; message: string; product: IProduct }>(`/admin/product/${id}`, productData);
    return res.data.product;
};

// Delete product (Admin only)
export const deleteProduct = async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete<{ success: boolean; message: string }>(`/admin/product/${id}`);
    return res.data;
};
