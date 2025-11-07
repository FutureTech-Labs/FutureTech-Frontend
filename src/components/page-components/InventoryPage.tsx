"use client";

import DataTable from "../common/Table";
import { useEffect, useState } from "react";
import IconButton from "../common/IconButton";
import SearchField from "../forms/SearchField";
import DropdownField from "../forms/DropDownField";
import { ScrollableTabs } from "../common/ScrollableTabs";
import ProductDetailsDialog from "../common/ProductDetailsDialog";
import { cn, toSentenceCase, formatCurrencyLKR } from "@/lib/utils";
import { getCategoriesAndBrands, getProducts } from "@/services/productService";

interface InventoryPageProps {
    role: "admin" | "cashier" | null;
}

const InventoryPage = ({ role }: InventoryPageProps) => {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [brands, setBrands] = useState<Brand[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [selectedBrand, setSelectedBrand] = useState("all");
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productRes, categoryBrandRes] = await Promise.all([
                    getProducts({ page }),
                    getCategoriesAndBrands(),
                ]);

                if (productRes.success) {
                    setProducts(productRes.products);
                    setTotalPages(productRes.totalPages);
                    setTotal(productRes.total);
                }

                if (categoryBrandRes.success) {
                    setCategories(categoryBrandRes.categories);
                    setBrands(categoryBrandRes.brands);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page]);

    const handleViewProduct = (product: IProduct) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    const columns = [
        {
            key: "createdAt",
            label: "Date",
            enableSorting: true,
            render: (p: IProduct) => new Date(p.createdAt).toLocaleDateString("en-GB") || "—",
        },
        {
            key: "name",
            label: "Product",
            render: (p: IProduct) => (
                <div className="max-w-60 truncate">{p.name || "—"}</div>
            ),
        },

        {
            key: "images",
            label: "Image",
            render: (p: IProduct) =>
                p.images?.[0] ? (
                    <img
                        src={p.images[0]}
                        alt={p.name}
                        width={50}
                        height={50}
                        className="object-cover rounded-lg"
                    />
                ) : (
                    "—"
                ),
        },
        {
            key: "sellingPrice",
            label: "Selling Price",
            enableSorting: true,
            render: (p: IProduct) => formatCurrencyLKR(p.sellingPrice) || "—",
        },
        {
            key: "status",
            label: "Status",
            render: (p: IProduct) => (
                <span
                    className={cn(
                        "px-3 py-1 text-sm font-medium rounded-full border transition-colors duration-200",
                        p.status === "active"
                            ? "bg-green-500/15 text-green-500 border-green-500/30"
                            : "bg-zinc-700/20 text-zinc-400 border-zinc-500/30"
                    )}
                >
                    {toSentenceCase(p.status)}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (p: IProduct) => (
                <div className="flex">
                    <IconButton
                        iconSrc="/icons/Eye.svg"
                        ariaLabel="view"
                        onClick={() => handleViewProduct(p)}
                    />

                    {role === "admin" && (
                        <>
                            <IconButton iconSrc="/icons/Edit.svg" ariaLabel="Edit" />
                            <IconButton iconSrc="/icons/Delete.svg" ariaLabel="Delete" />
                        </>
                    )}
                </div>
            ),
        },
    ];

    const tabs = [
        { value: "all", label: "All Products" },
        ...categories.map((cat) => ({
            value: cat._id,
            label: toSentenceCase(cat.name)
        })),
    ];

    const filteredProducts = products.filter((p) => {
        const matchesCategory =
            selectedCategory === "all" || !selectedCategory
                ? true
                : p.category && p.category._id === selectedCategory;

        const matchesBrand =
            selectedBrand === "all" || !selectedBrand
                ? true
                : p.brand && p.brand._id === selectedBrand;

        const search = searchTerm.toLowerCase();

        const matchesSearch = search
            ? p.name.toLowerCase().includes(search) ||
            p.category?.name.toLowerCase().includes(search) ||
            p.brand?.name.toLowerCase().includes(search)
            : true;

        return matchesCategory && matchesBrand && matchesSearch;
    });



    return (
        <div className="flex flex-col gap-6 p-5 rounded-xl border-2 border-gradient border-primary-900/40 table-bg-gradient shadow-lg shadow-primary-900/15">

            <div className="flex md:flex-row flex-col gap-5 items-center justify-between w-full">
                <SearchField
                    placeholder="Search products, brands or categories..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onClear={() => setSearchTerm("")}
                    className="md:max-w-md"
                />
                <DropdownField
                    label="Brand"
                    items={brands}
                    selected={selectedBrand}
                    onChange={(value) => setSelectedBrand(value)}
                    placeholder="Select a brand"
                />
            </div>

            <div className="w-full">
                <ScrollableTabs
                    activeTab={selectedCategory}
                    onTabChange={setSelectedCategory}
                    tabs={tabs}
                />
            </div>

            <DataTable
                columns={columns}
                data={filteredProducts}
                loading={loading}
                pagination={{
                    page,
                    totalPages,
                    total,
                    onPageChange: (newPage) => setPage(newPage),
                }}
            />

            <ProductDetailsDialog
                product={selectedProduct}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </div>
    );
};

export default InventoryPage;