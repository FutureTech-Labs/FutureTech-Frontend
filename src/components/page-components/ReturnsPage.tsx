"use client";

import { useState } from "react";
import DataTable from "../common/Table";
import SearchField from "../forms/SearchField";
import SelectField from "../forms/SelectField";
import IconButton from "../common/IconButton";
import { getAllSales } from "@/services/salesServices";

const ReturnsPage = () => {
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [loading, setLoading] = useState(false);

    const [invoice, setInvoice] = useState<ISalesInvoiceResponse | null>(null);

    // Static pagination for now
    const page = 1;
    const totalPages = 1;
    const total = invoice ? 1 : 0;

    const handleSearch = async () => {
        if (!search.trim()) {
            setInvoice(null);
            return;
        }

        try {
            setLoading(true);

            const res = await getAllSales({
                invoiceNumber: search.trim(),
                page: 1,
                limit: 1
            });

            if (res.data.length > 0) {
                setInvoice(res.data[0]);
            } else {
                setInvoice(null);
            }

        } catch (err) {
            console.error(err);
            setInvoice(null);
        } finally {
            setLoading(false);
        }
    };


    const columns = [
        {
            key: "invoiceNumber",
            label: "Invoice ID",
            render: (row: ISalesInvoiceResponse) => row.invoiceNumber,
        },
        {
            key: "createdAt",
            label: "Date",
            render: (row: ISalesInvoiceResponse) =>
                new Date(row.createdAt).toLocaleDateString("en-GB"),
        },
        {
            key: "customer",
            label: "Customer",
            render: (row: ISalesInvoiceResponse) => row.customer.name,
        },
        {
            key: "total",
            label: "Total Amount",
            render: (row: ISalesInvoiceResponse) =>
                `Rs. ${row.total.toLocaleString()}`,
        },
        {
            key: "paymentStatus",
            label: "Payment Status",
            render: (row: ISalesInvoiceResponse) => (
                <span
                    className={`px-2 py-1 rounded text-xs ${row.paymentStatus === "paid"
                        ? "bg-green-600"
                        : "bg-red-600"
                        }`}
                >
                    {row.paymentStatus}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: () => (
                <IconButton
                    iconSrc="/icons/Eye.svg"
                    ariaLabel="view"
                    onClick={() => { }}
                />
            ),
        },
    ];

    return (
        <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-6 p-5 rounded-xl border-2 border-primary-900/40 table-bg-gradient shadow-lg shadow-primary-900/15">

                <div className="flex md:flex-row flex-col gap-5 items-center justify-between w-full">

                    {/* Invoice Search */}
                    <div className="flex items-center gap-3">
                        <SearchField
                            placeholder="Search invoice by ID"
                            value={search}
                            onChange={setSearch}
                            onClear={() => {
                                setSearch("");
                                setInvoice(null);
                            }}
                            className="md:max-w-md"
                        />

                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 rounded bg-primary-800 hover:bg-primary-700 text-white text-sm transition"
                        >
                            Search
                        </button>
                    </div>

                    {/* Status Filter Placeholder */}
                    <SelectField
                        placeholder="Filter status"
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        options={[
                            { label: "All", value: "all" },
                            { label: "Paid", value: "paid" },
                        ]}
                        width="md:w-[150px]"
                        className="bg-black-500! border border-white/50 text-xs md:text-sm"
                    />
                </div>

                {/* Invoice Table */}
                <DataTable
                    columns={columns}
                    data={invoice ? [invoice] : []}
                    loading={loading}
                    pagination={{
                        page,
                        totalPages,
                        total,
                        onPageChange: () => { },
                    }}
                />
            </div>
        </div>
    );
};

export default ReturnsPage;
