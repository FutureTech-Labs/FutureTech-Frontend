"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { Boxes, CircleDollarSign, PackageCheck, PackageX, Plus } from "lucide-react";

import DataTable from "../common/Table";
import StatCard from "../cards/StatCard";
import DialogBox from "../common/DialogBox";
import IconButton from "../common/IconButton";
import SearchField from "../forms/SearchField";
import SelectField from "../forms/SelectField";
import ProductForm from "../forms/AddProducts";
import ProductDetails from "../common/ProductDetails";
import ExportPDFButton from "../common/ExportPdfButton";
import { ScrollableTabs } from "../common/ScrollableTabs";
import PaginationSlider from "../sliders/PaginationSlider";

import { useEdgeStore } from "@/lib/edgestore";
import { cn, toSentenceCase, formatCurrencyLKR } from "@/lib/utils";
import { deleteProduct, getCategoriesAndBrands, getProducts } from "@/services/productService";

interface InventoryPageProps {
    role: "admin" | "cashier" | null;
}

const InventoryPage = ({ role }: InventoryPageProps) => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const [brands, setBrands] = useState<Brand[]>([]);
    const [selectedBrand, setSelectedBrand] = useState("all");
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

    const [stats, setStats] = useState({ totalProducts: 0, activeProducts: 0, inactiveProducts: 0, totalValue: 0, });

    const [viewDialogOpen, setviewDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);

    const { edgestore } = useEdgeStore();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productRes, categoryBrandRes] = await Promise.all([
                getProducts({
                    page,
                    search: searchTerm || undefined,
                    category: selectedCategory !== "all" ? selectedCategory : undefined,
                    brand: selectedBrand !== "all" ? selectedBrand : undefined,
                }),
                getCategoriesAndBrands(),
            ]);

            if (productRes.success) {
                setProducts(productRes.products);
                setTotalPages(productRes.totalPages);
                setTotal(productRes.total);
                if (productRes.stats) setStats(productRes.stats);
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
    }, [page, searchTerm, selectedCategory, selectedBrand]);


    const handleViewProduct = (product: IProduct) => {
        setSelectedProduct(product);
        setviewDialogOpen(true);
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

    const totalProductsByCategory = categories.reduce((sum, cat) => sum + (cat.count || 0), 0);

    const { totalProducts, activeProducts, inactiveProducts, totalValue } = stats;

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
                    <div className="relative w-[60px] h-9">
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
        { value: "all", label: `All Products (${totalProductsByCategory})` },
        ...categories.map((cat) => ({
            value: cat._id,
            label: `${toSentenceCase(cat.name)} (${cat.count || 0})`,
        })),
    ];

    const cards = [
        <StatCard
            key="total"
            title="Total Products"
            value={totalProducts}
            icon={<Boxes className="w-5 h-5 text-lime-400" />}
            iconBg="bg-lime-500/10"
            gradient="linear-gradient(79.74deg, rgba(166, 255, 0, 0.12) 0%, rgba(0, 0, 0, 0.12) 100%)"
        />,
        <StatCard
            key="active"
            title="Active Products"
            value={activeProducts}
            icon={<PackageCheck className="w-5 h-5 text-green-400" />}
            iconBg="bg-green-500/10"
            gradient="linear-gradient(79.74deg, rgba(0, 255, 132, 0.12) 0%, rgba(0, 0, 0, 0.12) 100%)"
        />,
        <StatCard
            key="inactive"
            title="Inactive Products"
            value={inactiveProducts}
            icon={<PackageX className="w-5 h-5 text-red-400" />}
            iconBg="bg-red-500/10"
            gradient="linear-gradient(79.74deg, rgba(255, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.12) 100%)"
        />,
        <StatCard
            key="value"
            title="Inventory Value"
            value={formatCurrencyLKR(totalValue, false)}
            icon={<CircleDollarSign className="w-5 h-5 text-amber-400" />}
            iconBg="bg-amber-500/10"
            gradient="linear-gradient(79.74deg, rgba(255, 230, 0, 0.12) 0%, rgba(0, 0, 0, 0.12) 100%)"
        />,
    ];


    return (
        <div className="relative flex flex-col gap-6">
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {cards}
            </div>

            {/* Mobile Slider */}
            <PaginationSlider>{cards}</PaginationSlider>

            {/* Table */}
            <div className="flex flex-col gap-6 p-5 rounded-xl border-2 border-gradient border-primary-900/40 table-bg-gradient shadow-lg 
            shadow-primary-900/15">

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
                            className="bg-black-500! border border-white/50 focus:ring-1! focus:ring-primary-800! text-xs md:text-sm"
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
                            data={products}
                            className="hidden md:flex"
                        />
                        {/* Add Products Button comes here to open the dialogBox */}
                        {role === "admin" && (
                            <Button
                                onClick={() => {
                                    setSelectedProduct(null);
                                    setAddDialogOpen(true);
                                }}
                                className="main-button-gradient border-none!"
                            >
                                Add New Product
                                <Plus />
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
                    data={products}
                    loading={loading}
                    pagination={{
                        page,
                        totalPages,
                        total,
                        onPageChange: (newPage) => setPage(newPage),
                    }}
                />

                {/* Add Product Dialog */}
                <DialogBox
                    open={addDialogOpen}
                    onOpenChange={setAddDialogOpen}
                    title={selectedProduct ? "Edit Product" : "Add New Product"}
                    description={
                        selectedProduct
                            ? "Update the product details below."
                            : "Add a new product to your inventory."
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

                {/* View product Dialog */}
                <DialogBox
                    open={viewDialogOpen}
                    onOpenChange={setviewDialogOpen}
                    title="Product Details"
                    widthClass="max-w-3xl"
                >
                    <ProductDetails
                        product={selectedProduct}
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
        </div>
    );
};

export default InventoryPage;