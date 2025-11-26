"use client";

import {
    Mail,
    Phone,
    MapPin,
    Building,
    FileText,
    Calendar,
    Landmark,
    CreditCard,
    Receipt,
    AlertCircle,
    Check,
    DollarSign,
} from "lucide-react";

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent
} from "@/components/ui/accordion";

import { JSX } from "react";
import { StatusBadge } from "../common/StatusBadge";
import { formatCurrencyLKR, toSentenceCase } from "@/lib/utils";

interface SupplierDetailsProps {
    supplier: ISupplier | null;
}

/* -------------------- FINANCIAL BUILDER --------------------*/
function buildSupplierFinance(supplier: ISupplier) {
    const payments = supplier.payments ?? [];
    const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const openingBalance = (supplier.outstandingBalance || 0) + totalPayments;

    return { openingBalance, totalPayments };
}

/* -------------------- MAIN COMPONENT -------------------- */
export default function SupplierDetails({ supplier }: SupplierDetailsProps) {
    if (!supplier) return null;

    const isPending = supplier.status === "pending";

    const pendingInvoices =
        supplier.purchaseHistory?.filter(
            (p): p is ISupplierPurchaseInvoice &
            { dueDate: string } => p.status === "pending" && !!p.dueDate
        ) || [];

    const nextDueDate = pendingInvoices.length
        ? pendingInvoices.sort(
            (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        )[0].dueDate
        : null;

    const { openingBalance, totalPayments } = buildSupplierFinance(supplier);

    return (
        <div className="flex flex-col space-y-6 w-full">
            {/* HEADER CARD */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-white">{supplier.name}</h1>
                        <p className="text-gray-300 flex items-center gap-2 text-sm">
                            <Building className="w-4 h-4" />
                            {supplier.company || "No company specified"}
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                        <StatusBadge
                            text={toSentenceCase(supplier.status)}
                            color={isPending ? "yellow" : "green"}
                            icon={
                                isPending ? (
                                    <AlertCircle className="w-3 h-3" />
                                ) : (
                                    <Check className="w-3 h-3" />
                                )
                            }
                        />

                        {nextDueDate && (
                            <p className="text-xs text-yellow-300 flex items-center gap-1 font-semibold mt-1">
                                <Calendar className="w-3 h-3" />
                                Due: {new Date(nextDueDate).toLocaleDateString("en-GB")}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CONTACT */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                    <SectionTitle title="Contact Information" />
                    <div className="space-y-4 mt-4">
                        <Field icon={<Mail className="w-4 h-4" />} label="Email" value={supplier.email} />
                        <Field icon={<Phone className="w-4 h-4" />} label="Phone" value={supplier.contact} />
                        <Field icon={<MapPin className="w-4 h-4" />} label="Address" value={supplier.address} />
                    </div>
                </div>

                {/* BANK */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                    <SectionTitle title="Bank Details" />
                    <div className="space-y-4 mt-4">
                        <Field icon={<Landmark className="w-4 h-4" />} label="Bank Name" value={supplier.bankDetails?.bankName} />
                        <Field icon={<CreditCard className="w-4 h-4" />} label="Account Number" value={supplier.bankDetails?.accountNumber} />
                    </div>
                </div>
            </div>

            {/* FINANCIAL OVERVIEW */}
            {isPending && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                    <SectionTitle title="Financial Overview" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        <FinancialCard icon={<FileText className="w-5 h-5" />} label="Had to pay" value={formatCurrencyLKR(openingBalance)} valueColor="text-white" />
                        <FinancialCard icon={<DollarSign className="w-5 h-5" />} label="Total Amounts Paid" value={formatCurrencyLKR(totalPayments)} valueColor="text-green-300" />
                        <FinancialCard icon={<CreditCard className="w-5 h-5" />} label="Outstanding Balance" value={formatCurrencyLKR(supplier.outstandingBalance)} valueColor={supplier.outstandingBalance > 0 ? "text-yellow-300" : "text-white"} />
                    </div>
                </div>
            )}

            {/* PURCHASE HISTORY */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                <SectionTitle title="Purchase History" />

                {supplier.purchaseHistory?.length ? (
                    <Accordion type="single" collapsible className="mt-4">
                        {supplier.purchaseHistory.map((p: ISupplierPurchaseInvoice, i: number) => {
                            const total = p.totalAmount ?? 0;
                            const paid = p.alreadyPaid ?? 0;
                            const remaining = p.remainingAmount ?? total - paid;

                            return (
                                <AccordionItem key={i} value={`inv_${p._id}`} className="border border-white/10 rounded-lg mb-2 bg-white/5">
                                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                                        <div className="flex justify-between w-full">
                                            <span className="font-medium text-white">Invoice #{p.invoiceNumber}</span>
                                            <span className="text-primary-300 font-semibold">{formatCurrencyLKR(total)}</span>
                                        </div>
                                    </AccordionTrigger>

                                    <AccordionContent className="px-4 py-3 space-y-3">
                                        {/* DATE */}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Date</span>
                                            <span className="text-white">
                                                {p.date ? new Date(p.date).toLocaleDateString("en-GB") : "—"}
                                            </span>
                                        </div>

                                        {/* STATUS */}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Status</span>
                                            <span className={`font-semibold ${p.status === "paid" ? "text-green-400" : "text-red-300"}`}>
                                                {toSentenceCase(p.status ?? "pending")}
                                            </span>
                                        </div>

                                        {/* TOTAL */}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Total Amount</span>
                                            <span className="text-white">{formatCurrencyLKR(total)}</span>
                                        </div>

                                        {/* PAID */}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Already Paid</span>
                                            <span className="text-green-300">{formatCurrencyLKR(paid)}</span>
                                        </div>

                                        {/* REMAINING */}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Remaining</span>
                                            <span className="text-yellow-300">{formatCurrencyLKR(remaining)}</span>
                                        </div>

                                        {/* PURCHASED ITEMS */}
                                        {p.items && p.items.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-xs font-medium text-gray-400 mb-2">Purchased Items</p>

                                                <div className="space-y-2">
                                                    {p.items.map((item, idx) => (
                                                        <div key={idx} className="bg-black/20 p-2 rounded-lg border border-white/5">
                                                            {/* PRODUCT NAME + QTY */}
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-white">{item.product?.name ?? "Unknown product"}</span>
                                                                <span className="text-gray-300">x {item.quantity}</span>
                                                            </div>

                                                            {/* COST PRICE */}
                                                            <div className="flex justify-between text-xs mt-1">
                                                                <span className="text-gray-400">Cost Price</span>
                                                                <span className="text-white">{formatCurrencyLKR(item.costPrice)}</span>
                                                            </div>

                                                            {/* LINE TOTAL */}
                                                            <div className="flex justify-between text-xs">
                                                                <span className="text-gray-400">Line Total</span>
                                                                <span className="text-primary-300 font-semibold">{formatCurrencyLKR(item.lineTotal)}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* DUE DATE */}
                                        {p.status !== "paid" && p.dueDate && (
                                            <div className="flex justify-between text-sm mt-2">
                                                <span className="text-gray-400">Due Date</span>
                                                <span className="text-yellow-300 font-semibold">
                                                    {new Date(p.dueDate).toLocaleDateString("en-GB")}
                                                </span>
                                            </div>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No purchase history available</p>
                    </div>
                )}
            </div>

            {/* PAYMENT HISTORY — DATE GROUPED */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                <SectionTitle title="Payment History" />

                {!supplier.payments || supplier.payments.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No payments recorded</p>
                    </div>
                ) : (
                    <Accordion type="multiple" className="mt-4 space-y-3">

                        {Object.entries(groupPaymentsByDate(supplier.payments)).map(
                            ([dateLabel, payments]) => (
                                <AccordionItem
                                    key={dateLabel}
                                    value={dateLabel}
                                    className="border border-white/10 rounded-lg bg-white/5"
                                >
                                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                                        <div className="flex justify-between w-full">
                                            <span className="font-medium text-white">
                                                {dateLabel}
                                            </span>
                                            <span className="text-primary-300 font-semibold">
                                                {formatCurrencyLKR(
                                                    payments.reduce((t, p) => t + p.amount, 0)
                                                )}
                                            </span>
                                        </div>
                                    </AccordionTrigger>

                                    <AccordionContent className="px-4 py-3 space-y-4">

                                        {payments.map((p, i) => (
                                            <div
                                                key={i}
                                                className="bg-black/20 p-3 rounded-lg border border-white/5"
                                            >
                                                {/* TOP SECTION */}
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-sm text-gray-300">
                                                        {p.paymentMethod === "cash"
                                                            ? "Cash Payment"
                                                            : "Online Transfer"}
                                                    </span>
                                                    <span className="text-green-300 font-semibold text-sm">
                                                        {formatCurrencyLKR(p.amount)}
                                                    </span>
                                                </div>

                                                {/* META  */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                                                    <LedgerTile
                                                        label="Outstanding Before"
                                                        value={formatCurrencyLKR(p.hadToPayBefore)}
                                                    />
                                                    <LedgerTile
                                                        label="Paid Amount"
                                                        value={formatCurrencyLKR(p.amount)}
                                                        valueColor="text-green-300"
                                                    />
                                                    <LedgerTile
                                                        label="Balance After"
                                                        value={formatCurrencyLKR(p.balanceAfter)}
                                                        valueColor={
                                                            p.balanceAfter > 0
                                                                ? "text-yellow-300"
                                                                : "text-white"
                                                        }
                                                    />
                                                </div>

                                                {/* NOTES */}
                                                {p.notes && (
                                                    <div className="mt-2 p-2 bg-black/20 rounded">
                                                        <p className="text-xs text-gray-400 mb-1">Notes</p>
                                                        <p className="text-sm text-white">{p.notes}</p>
                                                    </div>
                                                )}

                                                {/* APPLIED INVOICES */}
                                                {p.appliedInvoices?.length > 0 && (
                                                    <div className="mt-2">
                                                        <p className="text-xs font-medium text-gray-400 mb-1">
                                                            Applied Invoices
                                                        </p>

                                                        <div className="space-y-1">
                                                            {p.appliedInvoices.map((a, j) => (
                                                                <div
                                                                    key={j}
                                                                    className="flex justify-between bg-black/10 p-2 rounded border border-white/5"
                                                                >
                                                                    <span className="text-sm text-gray-300">
                                                                        Invoice #{a.invoice?.invoiceNumber}
                                                                    </span>
                                                                    <span className="text-sm text-primary-300 font-semibold">
                                                                        {formatCurrencyLKR(a.amount)}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                    </AccordionContent>
                                </AccordionItem>
                            )
                        )}

                    </Accordion>
                )}
            </div>

            {/* FOOTER */}
            <div className="sticky -bottom-px flex bg-black-500 justify-between items-center py-4 border-t border-white/10 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Supplier Added on {new Date(supplier.createdAt).toLocaleDateString("en-GB")}</span>
                </div>
                <div className="text-right">
                    <span className="text-xs bg-white/5 px-2 rounded">
                        Supplier ID: {supplier._id?.slice(-8) || "N/A"}
                    </span>
                </div>
            </div>
        </div>
    );
}

/* -------- COMPONENTS -------- */
function Field({
    label,
    value,
    icon,
    accent = false,
}: {
    label: string;
    value: string | number | undefined | null;
    icon: JSX.Element;
    accent?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-3 py-2">
            <div className="flex items-center gap-3 text-gray-300">
                {icon}
                <span className="text-sm">{label}</span>
            </div>
            <span className={`text-sm ${accent ? "text-yellow-300 font-semibold" : "text-white text-right"}`}>
                {value ?? "—"}
            </span>
        </div>
    );
}

function SectionTitle({ title }: { title: string }) {
    return <h2 className="font-semibold text-lg text-white border-b border-white/10 pb-3">{title}</h2>;
}

function FinancialCard({
    icon,
    label,
    value,
    valueColor,
    accent = false,
}: {
    icon: JSX.Element;
    label: string;
    value: string | number;
    valueColor: string;
    accent?: boolean;
}) {
    return (
        <div className={`bg-white/5 p-4 rounded-lg border ${accent ? "border-primary-500/30" : "border-white/5"} hover:bg-white/10 transition-colors`}>
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${accent ? "bg-primary-500/20" : "bg-white/10"}`}>{icon}</div>
            </div>
            <p className="text-sm text-gray-400 mb-1">{label}</p>
            <p className={`text-lg font-bold ${valueColor}`}>{value}</p>
        </div>
    );
};

function LedgerTile({
    label,
    value,
    valueColor,
}: {
    label: string;
    value: string;
    valueColor?: string;
}) {
    return (
        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className={`text-sm font-semibold ${valueColor ?? "text-white"}`}>
                {value}
            </p>
        </div>
    );
};

function groupPaymentsByDate(payments: ISupplierPayment[]) {
    const grouped: Record<string, ISupplierPayment[]> = {};

    payments.forEach((p) => {
        const date = new Date(p.datePaid);
        const label = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

        if (!grouped[label]) grouped[label] = [];
        grouped[label].push(p);
    });

    return grouped;
}
