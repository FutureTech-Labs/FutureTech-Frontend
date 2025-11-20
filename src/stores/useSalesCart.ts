import { create } from "zustand";

interface CartItem {
    product: IProduct;
    quantity: number;
    discount: number;
}

interface SalesCartState {
    items: CartItem[];
    addItem: (product: IProduct) => void;
    updateItem: (productId: string, qty: number) => void;
    updateDiscount: (productId: string, discount: number) => void;
    removeItem: (productId: string) => void;
    clear: () => void;
}

export const useSalesCart = create<SalesCartState>((set) => ({
    items: [],

    addItem: (product) =>
        set((state) => {
            const exists = state.items.find((i) => i.product._id === product._id);

            if (exists)
                return {
                    items: state.items.map((i) =>
                        i.product._id === product._id
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                    ),
                };

            return {
                items: [
                    ...state.items,
                    { product, quantity: 1, discount: 0 }
                ],
            };
        }),

    updateItem: (productId, qty) =>
        set((state) => ({
            items: state.items.map((i) =>
                i.product._id === productId ? { ...i, quantity: qty } : i
            ),
        })),

    updateDiscount: (productId, discount) =>
        set((state) => ({
            items: state.items.map((i) =>
                i.product._id === productId ? { ...i, discount } : i
            ),
        })),

    removeItem: (productId) =>
        set((state) => ({
            items: state.items.filter((i) => i.product._id !== productId),
        })),

    clear: () => set({ items: [] }),
}));
