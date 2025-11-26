'use client';

import { useEffect, useState } from "react";
import IconButton from "../common/IconButton";
import { Check, AlertCircle, Plus, CircleCheckBig } from "lucide-react";
import { StatusBadge } from "../common/StatusBadge";
import { formatCurrencyLKR, toSentenceCase } from "@/lib/utils";

import { getSupplierById, getSuppliers, toggleSupplierStatus } from "@/services/supplierServices";
import DataTable from "../common/Table";
import SearchField from "../forms/SearchField";
import SelectField from "../forms/SelectField";
import ExportPDFButton from "../common/ExportPdfButton";
import { Button } from "../ui/button";
import DialogBox from "../common/DialogBox";
import SupplierDetails from "../common/SupplierDetails";
import SupplierForm from "../forms/SupplierForm";
import PaySupplierForm from "../forms/SupplierPayForm";
import { toast } from "sonner";
import { Tab } from "../common/Tab";

const SupplierPage = () => {
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [minBalance, setMinBalance] = useState<number | undefined>();
    const [maxBalance, setMaxBalance] = useState<number | undefined>();
    const [selectedSupplier, setSelectedSupplier] = useState<ISupplier | null>(null);
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<"all" | "paid" | "pending">("all");
    const [supplierStatus, setSupplierStatus] = useState<"all" | "active" | "inactive">("all");

    const [viewDialogOpen, setviewDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const [totalPages, setTotalPages] = useState(1);
    const [totalSuppliers, setTotalSuppliers] = useState(0);

    const [payDialogOpen, setPayDialogOpen] = useState(false);


    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getSuppliers({
                page,
                search: search || undefined,
                status: selectedPaymentStatus !== "all" ? selectedPaymentStatus : undefined,
                supplierStatus: supplierStatus !== "all" ? supplierStatus : undefined,
                minBalance,
                maxBalance,
            });

            if (res.success) {
                setSuppliers(res.suppliers);
                setTotalPages(res.pages);
                setTotalSuppliers(res.total);
            }
        } catch (error) {
            console.error("Failed to fetch suppliers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, search, selectedPaymentStatus, supplierStatus, minBalance, maxBalance]);


    const handleViewSupplier = async (supplier: ISupplier) => {
        const full = await getSupplierById(supplier._id);
        setSelectedSupplier(full);
        setviewDialogOpen(true);
    };


    const handlePaySupplier = async (supplier: ISupplier) => {
        const full = await getSupplierById(supplier._id);
        setSelectedSupplier(full);
        setPayDialogOpen(true);
    };

    const handleDeactivateClick = async (supplier: ISupplier) => {
        try {
            const res = await toggleSupplierStatus(supplier._id);

            toast.success(res.message);
            fetchData();

        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update supplier");
        }
    };

    const supplierColumns = [
        {
            key: "name",
            label: "Name",
            render: (s: ISupplier) => s.name,
        },
        {
            key: "phone",
            label: "Contact",
            render: (s: ISupplier) => s.contact || "—",
        },
        {
            key: "balance",
            label: "Balance (LKR)",
            render: (s: ISupplier) => formatCurrencyLKR(s.outstandingBalance) || "0",
        },
        {
            key: "status",
            label: "Payment Status",
            render: (s: ISupplier) => (
                <StatusBadge
                    text={toSentenceCase(s.status)}
                    color={s.status === "pending" ? "yellow" : "green"}
                    icon={
                        s.status === "pending" ? (
                            <AlertCircle className="w-3 h-3" />
                        ) : (
                            <Check className="w-3 h-3" />
                        )
                    }
                />
            ),
        },
        {
            key: "supplierStatus",
            label: "Supplier Status",
            render: (s: ISupplier) => (
                <StatusBadge
                    text={s.isActive ? "Active" : "Inactive"}
                    color={s.isActive ? "purple" : "red"}
                    icon={
                        s.isActive
                            ? <CircleCheckBig className="w-3 h-3" />
                            : <AlertCircle className="w-3 h-3" />
                    }
                />

            ),
        },
        {
            key: "pay",
            label: "Pay",
            render: (s: ISupplier) =>
                s.status === "pending" ? (
                    <button
                        className="text-primary-500 hover:underline text-sm font-medium"
                        onClick={() => handlePaySupplier(s)}
                    >
                        Pay
                    </button>
                ) : (
                    <CircleCheckBig className="w-4.5 h-4.5 text-green-500/50" />
                )
        },
        {
            key: "actions",
            label: "Actions",
            render: (s: ISupplier) => (
                <div className="flex gap-1">
                    {/* View */}
                    <IconButton
                        iconSrc="/icons/Eye.svg"
                        ariaLabel="view"
                        onClick={() => handleViewSupplier(s)}
                    />

                    {/* Edit */}
                    <IconButton
                        iconSrc="/icons/Edit.svg"
                        ariaLabel="Edit"
                        onClick={() => {
                            setSelectedSupplier(s);
                            setAddDialogOpen(true);
                        }}
                    />

                    {/* Activate / Deactivate */}
                    <IconButton
                        iconSrc={s.isActive ? "/icons/Minus.svg" : "/icons/UserCheck.svg"}
                        ariaLabel={s.isActive ? "Deactivate" : "Activate"}
                        onClick={() => handleDeactivateClick(s)}
                    />
                </div>
            ),
        }
    ];

    return (
        <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-6 p-5 rounded-xl border-2 border-gradient border-primary-900/40 table-bg-gradient shadow-lg 
            shadow-primary-900/15">

                <div className="flex lg:flex-row flex-col gap-5 items-center justify-between w-full">

                    {/* Search filter */}
                    <SearchField
                        placeholder="Search suppliers by name, company, or phone"
                        value={search}
                        onChange={setSearch}
                        onClear={() => setSearch("")}
                        className="lg:max-w-md"
                    />

                    <div className="flex lg:flex-row flex-col gap-5 w-full justify-end">
                        {/* Brand Select filter */}
                        <SelectField
                            placeholder="Supplier Status"
                            value={supplierStatus}
                            onChange={(value) => setSupplierStatus(value as "all" | "active" | "inactive")}
                            options={[
                                { value: "all", label: "All Suppliers" },
                                { value: "active", label: "Active" },
                                { value: "inactive", label: "Inactive" },
                            ]}
                            width="lg:w-[180px]"
                            className="bg-black-500! border border-white/50 focus:ring-1! focus:ring-primary-800! text-xs md:text-sm"
                        />


                        <ExportPDFButton
                            title="Supplier Report"
                            fileName="Suppliers.pdf"
                            columns={[
                                { header: "Name", key: "name" },
                                { header: "Company", key: "company" },
                                { header: "Phone", key: "contact" },
                                { header: "Balance", key: "outstandingBalance", format: (v) => formatCurrencyLKR(v) },
                                { header: "Status", key: "status" },
                            ]}
                            data={suppliers}
                            className="hidden md:flex"
                        />

                        <Button
                            onClick={() => {
                                setSelectedSupplier(null);
                                setAddDialogOpen(true);
                            }}
                            className="main-button-gradient border-none!"
                        >
                            Add New Supplier
                            <Plus />
                        </Button>
                    </div>
                </div>

                <Tab
                    activeTab={selectedPaymentStatus}
                    onChange={(value) => setSelectedPaymentStatus(value as "all" | "paid" | "pending")}
                    tabs={[
                        { label: "All", value: "all" },
                        { label: "Paid", value: "paid" },
                        { label: "Pending", value: "pending" },
                    ]}
                    className="max-w-md"
                />

                <DataTable
                    columns={supplierColumns}
                    data={suppliers}
                    loading={loading}
                    pagination={{
                        page,
                        totalPages,
                        total: totalSuppliers,
                        onPageChange: (newPage) => setPage(newPage),
                    }}
                />

                {/* View product Dialog */}
                <DialogBox
                    open={viewDialogOpen}
                    onOpenChange={setviewDialogOpen}
                    title="Supplier Details"
                    widthClass="lg:min-w-3xl!"
                >
                    <SupplierDetails supplier={selectedSupplier} />
                </DialogBox>

                {/* Add/ edit supplier details */}
                <DialogBox
                    open={addDialogOpen}
                    onOpenChange={setAddDialogOpen}
                    title={selectedSupplier ? "Edit Supplier" : "Add New Supplier"}
                    description={
                        selectedSupplier
                            ? "Update supplier details below."
                            : "Add a new supplier to your system."
                    }
                    widthClass="max-w-3xl"
                >
                    <SupplierForm
                        supplier={selectedSupplier}
                        onSuccess={() => {
                            setAddDialogOpen(false);
                            setSelectedSupplier(null);
                            fetchData();
                        }}
                        onCancel={() => {
                            setAddDialogOpen(false);
                            setSelectedSupplier(null);
                        }}
                    />
                </DialogBox>


                {/* Pay Supplier Dialog */}
                <DialogBox
                    open={payDialogOpen}
                    onOpenChange={setPayDialogOpen}
                    title="Pay Supplier"
                    widthClass="max-w-2xl"
                >
                    <PaySupplierForm
                        supplier={selectedSupplier}
                        onSuccess={() => {
                            setPayDialogOpen(false);
                            setSelectedSupplier(null);
                            fetchData();
                        }}
                        onCancel={() => {
                            setPayDialogOpen(false);
                            setSelectedSupplier(null);
                        }}
                    />
                </DialogBox>



            </div>
        </div>
    );
};

export default SupplierPage;
