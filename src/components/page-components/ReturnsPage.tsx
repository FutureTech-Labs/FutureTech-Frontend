"use client";

import { useState, useEffect } from "react";
import DataTable from "../common/Table";
import DialogBox from "../common/DialogBox";
import ReturnForm from "../forms/ReturnForm";
import IconButton from "../common/IconButton";
import SearchField from "../forms/SearchField";

import { getAllSales, getSaleById } from "@/services/salesServices";
import { getReturnById, getReturns } from "@/services/returnServices";
import ReturnInvoice from "../common/return-invoice/ReturnInvoice";
import ComboBoxField from "../forms/ComboField";

const ReturnsPage = () => {
    const [searchValue, setSearchValue] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [viewLoading, setViewLoading] = useState(false);

    const [invoice, setInvoice] = useState<ISalesInvoiceResponse | null>(null);
    const [returnFormDialog, setReturnFormDialog] = useState(false);

    const [returnInvoiceDialog, setReturnInvoiceDialog] = useState(false);
    const [selectedReturnInvoice, setSelectedReturnInvoice] = useState<IReturn | null>(null);

    const [invoiceOptions, setInvoiceOptions] = useState<{ value: string; label: string }[]>([]);


    const [returnedList, setReturnedList] = useState<IReturn[]>([]);
    const [returnsLoading, setReturnsLoading] = useState(false);
    const [returnsPage, setReturnsPage] = useState(1);
    const [returnsTotalPages, setReturnsTotalPages] = useState(1);
    const [returnsTotal, setReturnsTotal] = useState(0);


    useEffect(() => {
        const loadInvoices = async () => {
            try {
                // Load all invoices (up to 9999)
                const res = await getAllSales({ page: 1, limit: 9999, invoiceNumber: "" });

                const options = res.data.map((inv: ISalesInvoiceResponse) => ({
                    value: inv._id,
                    label: `${inv.invoiceNumber} — ${inv.customer.name}`,
                }));

                setInvoiceOptions(options);
            } catch (err) {
                console.error("Failed to load invoices:", err);
            }
        };

        loadInvoices();
    }, []);


    useEffect(() => {
        const fetchInvoice = async () => {
            if (!searchValue.trim()) {
                setInvoice(null);
                return;
            }

            try {
                setSearchLoading(true);

                const res = await getSaleById(searchValue);
                setInvoice(res.invoice);
            } catch (e) {
                console.error(e);
                setInvoice(null);
            } finally {
                setSearchLoading(false);
            }
        };

        fetchInvoice();
    }, [searchValue]);



    // FETCH RETURNS
    const fetchReturns = async (page = 1) => {
        try {
            setReturnsLoading(true);

            const res = await getReturns({ page, limit: 10 });

            setReturnedList(res.data);
            setReturnsTotal(res.total);
            setReturnsTotalPages(Math.ceil(res.total / 10));
            setReturnsPage(page);

        } catch (err) {
            console.log(err);
        } finally {
            setReturnsLoading(false);
        }
    };

    useEffect(() => {
        fetchReturns(1);
    }, []);


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
            key: "returnedQty",
            label: "Returned",
            render: (row: ISalesInvoiceResponse) => {
                const totalReturned = row.items.reduce(
                    (sum, it) => sum + (it.returnedQty ?? 0),
                    0
                );
                return totalReturned;
            },
        },
        {
            key: "remainingQty",
            label: "Remaining",
            render: (row: ISalesInvoiceResponse) => {
                const remaining = row.items.reduce(
                    (sum, it) =>
                        sum +
                        ((it.quantity ?? 0) - (it.returnedQty ?? 0)),
                    0
                );
                return remaining;
            },
        },
        {
            key: "status",
            label: "Status",
            render: (row: ISalesInvoiceResponse) => {
                const totalReturned = row.items.reduce(
                    (sum, it) => sum + (it.returnedQty ?? 0),
                    0
                );

                const totalQty = row.items.reduce(
                    (sum, it) => sum + it.quantity,
                    0
                );

                if (totalReturned === 0) {
                    return (
                        <span className="px-2 py-1 text-xs rounded bg-green-700 text-white">
                            Active
                        </span>
                    );
                }

                if (totalReturned === totalQty) {
                    return (
                        <span className="px-2 py-1 text-xs rounded bg-red-700 text-white">
                            Fully Returned
                        </span>
                    );
                }

                return (
                    <span className="px-2 py-1 text-xs rounded bg-yellow-700 text-white">
                        Partially Returned
                    </span>
                );
            },
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
            render: (row: ISalesInvoiceResponse) => (
                <IconButton
                    iconSrc="/icons/Eye.svg"
                    ariaLabel="view"
                    onClick={async () => {
                        try {
                            setViewLoading(true);

                            const full = await getSaleById(row._id);
                            setInvoice(full.invoice);
                            setReturnFormDialog(true);
                        } catch (e) {
                            console.error(e);
                        } finally {
                            setViewLoading(false);
                        }
                    }}
                />
            ),
        },
    ];


    const Retrunedcolumns = [
        {
            key: "_id",
            label: "Return ID",
            render: (r: IReturn) => r._id.slice(-6).toUpperCase(),
        },
        {
            key: "invoiceNumber",
            label: "Invoice",
            render: (r: IReturn) => r.saleInvoice.invoiceNumber,
        },
        {
            key: "product",
            label: "Product",
            render: (r: IReturn) => r.items[0].productName,
        },
        {
            key: "qty",
            label: "Qty",
            render: (r: IReturn) => r.items[0].quantity,
        },
        {
            key: "returnType",
            label: "Type",
            render: (r: IReturn) => (
                <span className="capitalize">{r.items[0].returnType}</span>
            ),
        },
        {
            key: "batch",
            label: "Batch",
            render: (r: IReturn) => {
                const item = r.items[0];

                if (item.returnType !== "replacement") return "—";

                const batches = item.replacementBatches ?? [];
                if (batches.length === 0) return "—";

                return (
                    <div className="flex flex-col text-xs text-white/60">
                        {batches.map((b, i) => (
                            <span key={i}>
                                {b.batch.batchCode ?? "—"} — {b.qty} qty
                            </span>
                        ))}
                    </div>
                );
            },
        },
        {
            key: "status",
            label: "Status",
            render: (r: IReturn) => (
                <span
                    className={`px-2 py-1 text-xs rounded ${r.status === "processed"
                        ? "bg-blue-700"
                        : r.status === "sent-to-supplier"
                            ? "bg-yellow-700"
                            : "bg-green-700"
                        }`}
                >
                    {r.status.replace(/-/g, " ")}
                </span>
            ),
        },

        {
            key: "actions",
            label: "Actions",
            render: (r: IReturn) => (
                <IconButton
                    iconSrc="/icons/Eye.svg"
                    ariaLabel="view-return"
                    onClick={async () => {
                        try {
                            setViewLoading(true);
                            const full = await getReturnById(r._id);
                            setSelectedReturnInvoice(full.data);
                            setReturnInvoiceDialog(true);
                        } catch (e) {
                            console.error(e);
                        } finally {
                            setViewLoading(false);
                        }
                    }}
                />
            ),
        },
    ];

    return (
        <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-6 p-5 rounded-xl border-2 border-primary-900/40 table-bg-gradient shadow-lg shadow-primary-900/15">

                {/* TOP BAR */}
                <div className="flex md:flex-row flex-col gap-5 items-center justify-between w-full">

                    {/* Search */}
                    <div className="flex gap-3 items-center w-full max-w-md">
                        <ComboBoxField
                            placeholder="Search or Select Invoice"
                            options={invoiceOptions}
                            value={searchValue}
                            onChange={(val) => {
                                setSearchValue(val);
                            }}
                            className="flex-1"
                        />
                    </div>
                </div>

                {/* Invoice Table */}
                <DataTable
                    columns={columns}
                    data={invoice ? [invoice] : []}
                    loading={searchLoading}
                    emptyMessage="Search for an Invoice"
                    pagination={{
                        page: 1,
                        totalPages: 1,
                        total: invoice ? 1 : 0,
                        onPageChange: () => { },
                    }}
                />

                {/* Return Form */}
                <DialogBox
                    open={returnFormDialog}
                    onOpenChange={setReturnFormDialog}
                    title="Product Return"
                    widthClass="min-w-5xl!"
                >
                    {invoice && (
                        <ReturnForm
                            invoice={invoice}
                            onClose={() => setReturnFormDialog(false)}
                            onSuccess={(createdReturn: IReturn) => {
                                fetchReturns();
                                setSelectedReturnInvoice(createdReturn);
                                setReturnInvoiceDialog(true);
                            }}
                        />
                    )}
                </DialogBox>
            </div>


            {/* Return Invoice */}
            <DialogBox
                open={returnInvoiceDialog}
                onOpenChange={setReturnInvoiceDialog}
                title="Product Return Invoice"
                widthClass="md:min-w-3xl!"
            >
                {/* We'll create a new invoice for return and call it here, don't need to mess up with sales and purchase */}
                {selectedReturnInvoice && (
                    <ReturnInvoice invoice={selectedReturnInvoice} />
                )}
            </DialogBox>

            {/* Returned products table (next step) */}
            <div className="flex flex-col gap-6 p-5 rounded-xl border-2 border-primary-900/40 table-bg-gradient shadow-lg shadow-primary-900/15">
                <h1 className="text-lg">Returned Products</h1>
                <DataTable
                    columns={Retrunedcolumns}
                    data={returnedList}
                    loading={returnsLoading}
                    emptyMessage="No returned products"
                    pagination={{
                        page: returnsPage,
                        totalPages: returnsTotalPages,
                        total: returnsTotal,
                        onPageChange: (p) => fetchReturns(p),
                    }}
                />
            </div>
        </div>
    );
};

export default ReturnsPage;
