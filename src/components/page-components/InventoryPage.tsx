"use client";

import Image from "next/image";
import { toast } from "sonner";
import { Button } from "../ui/button";
import DataTable from "../common/Table";
import DialogBox from "../common/DialogBox";
import { useEffect, useState } from "react";
import IconButton from "../common/IconButton";
import { useEdgeStore } from "@/lib/edgestore";
import SearchField from "../forms/SearchField";
import SelectField from "../forms/SelectField";
import ProductForm from "../forms/AddProducts";
import ExportPDFButton from "../common/ExportPdfButton";
import { ScrollableTabs } from "../common/ScrollableTabs";
import ProductDetailsDialog from "../common/ProductDetailsDialog";
import { cn, toSentenceCase, formatCurrencyLKR } from "@/lib/utils";
import { deleteProduct, getCategoriesAndBrands, getProducts } from "@/services/productService";


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
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [selectedBrand, setSelectedBrand] = useState("all");
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);

    const { edgestore } = useEdgeStore();

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

    useEffect(() => {
        fetchData();
    }, [page]);

    const handleViewProduct = (product: IProduct) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    const handleDeleteClick = (product: IProduct) => {
        setProductToDelete(product);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        setDeleting(true);
        try {
            if (productToDelete.images?.length) {
                await Promise.all(
                    productToDelete.images.map(async (url) => {
                        try {
                            await edgestore.productImages.delete({ url });
                        } catch (err) {
                            console.warn("Failed to delete image:", url, err);
                        }
                    })
                );
            }

            await deleteProduct(productToDelete._id);
            toast.success("Product and images deleted successfully");
            setDeleteDialogOpen(false);
            setProductToDelete(null);
            await fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete product");
        } finally {
            setDeleting(false);
        }
    };

    const totalProducts = categories.reduce((sum, cat) => sum + (cat.count || 0), 0);

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
                    <div className="relative w-[60px] h-10">
                        <Image
                            src={p.images[0]}
                            alt={p.name || "Product Image"}
                            fill
                            className="object-cover rounded"
                            priority={false}
                        />
                    </div>
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
                            <IconButton
                                iconSrc="/icons/Edit.svg"
                                ariaLabel="Edit"
                                onClick={() => {
                                    setSelectedProduct(p);
                                    setAddDialogOpen(true);
                                }}
                            />

                            <IconButton iconSrc="/icons/Delete.svg" ariaLabel="Delete"
                                onClick={() => handleDeleteClick(p)} />
                        </>
                    )}
                </div>
            ),
        },
    ];

    const tabs = [
        { value: "all", label: `All Products (${totalProducts})` },
        ...categories.map((cat) => ({
            value: cat._id,
            label: `${toSentenceCase(cat.name)} (${cat.count || 0})`,
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
        <div className="relative flex flex-col gap-6 p-5 rounded-xl border-2 border-gradient border-primary-900/40 table-bg-gradient shadow-lg shadow-primary-900/15">

            <div className="flex md:flex-row flex-col gap-5 items-center justify-between w-full">
                {/* Search filter */}
                <SearchField
                    placeholder="Search products, brands or categories..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onClear={() => setSearchTerm("")}
                    className="md:max-w-md"
                />
                <div className="flex md:flex-row flex-col gap-5 w-full justify-end">
                    {/* Brand Select filter */}
                    <SelectField
                        placeholder="Select a brand"
                        value={selectedBrand}
                        onChange={setSelectedBrand}
                        options={[
                            { value: "all", label: "All Brands" },
                            ...brands.map((b) => ({
                                value: b._id,
                                label: b.name,
                            })),
                        ]}
                        width="md:w-[150px]"
                        className="bg-black-500! border border-white focus:ring-1! focus:ring-primary-800! text-xs md:text-sm"
                    />
                    {/* Export button */}
                    <ExportPDFButton
                        title="Product Inventory Report"
                        fileName="products.pdf"
                        columns={[
                            { header: "Name", key: "name" },
                            { header: "Price", key: "sellingPrice", format: (v) => formatCurrencyLKR(v) },
                            { header: "Category", key: "category.name" },
                            { header: "Status", key: "status" },
                        ]}
                        data={filteredProducts}
                    />

                    {/* Add Products Button comes here to open the dialogBox */}
                    {role === "admin" && (
                        <Button
                            onClick={() => {
                                setSelectedProduct(null);
                                setAddDialogOpen(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md"
                        >
                            + Add Product
                        </Button>

                    )}
                </div>
            </div>

            <div className="w-full">
                {/* Category Filter */}
                <ScrollableTabs
                    activeTab={selectedCategory}
                    onTabChange={setSelectedCategory}
                    tabs={tabs}
                />
            </div>

            {/* Table */}
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

            {/* Dialog */}
            <ProductDetailsDialog
                product={selectedProduct}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />

            {/* Add Product Dialog */}
            <DialogBox
                open={addDialogOpen}
                onOpenChange={setAddDialogOpen}
                title={selectedProduct ? "Edit Product" : "Add New Product"}
                description={
                    selectedProduct
                        ? "Update the product details below."
                        : "Fill in the product details and upload images."
                }
                widthClass="max-w-3xl"
            >
                <ProductForm
                    brands={brands}
                    categories={categories}
                    product={selectedProduct}
                    onSuccess={() => {
                        setAddDialogOpen(false);
                        setSelectedProduct(null);
                        fetchData();
                    }}
                    onCancel={() => {
                        setAddDialogOpen(false);
                        setSelectedProduct(null);
                    }}
                />
            </DialogBox>

            {/* Delete Confirmation Dialog */}
            <DialogBox
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Product"
                centerTitle
                showFooter
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteDialogOpen(false)}
                confirmLoading={deleting}
            >
                <div className="text-center text-sm text-gray-400 mt-2 whitespace-pre-line">
                    Are you sure you want to delete "{productToDelete?.name}"?
                    {"\n"}This action cannot be undone.
                </div>
            </DialogBox>




        </div>
    );
};

export default InventoryPage;