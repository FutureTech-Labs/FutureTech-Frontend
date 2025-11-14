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

import { StatusBadge } from "../common/StatusBadge";
import { formatCurrencyLKR, toSentenceCase } from "@/lib/utils";

interface SupplierDetailsProps {
    supplier: ISupplier | null;
}

/* -------------------- FINANCIAL BUILDER  --------------------*/
function buildSupplierFinance(supplier: ISupplier) {
    if (!supplier) {
        return { openingBalance: 0, totalPayments: 0 };
    }

    const payments = supplier.payments ?? [];
    const purchases = supplier.purchaseHistory ?? [];

    const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Opening balance = outstandingBalance + totalPayments
    const openingBalance = (supplier.outstandingBalance || 0) + totalPayments;

    return {
        openingBalance,
        totalPayments,
    };
}

/* -------------------- MAIN COMPONENT -------------------- */

export default function SupplierDetails({ supplier }: SupplierDetailsProps) {
    if (!supplier) return null;

    const isPending = supplier.status === "pending";

    const { openingBalance, totalPayments } = buildSupplierFinance(supplier);

    return (
        <div className="flex flex-col space-y-6 w-full pb-5">
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
                </div>
            </div>

            {/* GRID LAYOUT FOR KEY SECTIONS */}
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

                {/* BANK DETAILS */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                    <SectionTitle title="Bank Details" />
                    <div className="space-y-4 mt-4">
                        <Field icon={<Landmark className="w-4 h-4" />} label="Bank Name" value={supplier.bankDetails?.bankName} />
                        <Field icon={<CreditCard className="w-4 h-4" />} label="Account Number" value={supplier.bankDetails?.accountNumber} />
                    </div>
                </div>
            </div>

            {/* FINANCIAL OVERVIEW */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                <SectionTitle title="Financial Overview" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    <FinancialCard
                        icon={<FileText className="w-5 h-5" />}
                        label="Had to pay"
                        value={formatCurrencyLKR(openingBalance)}
                        valueColor="text-white"
                    />
                    <FinancialCard
                        icon={<DollarSign className="w-5 h-5" />}
                        label="Total Amounts Paid"
                        value={formatCurrencyLKR(totalPayments)}
                        valueColor="text-green-300"
                    />
                    <FinancialCard
                        icon={<CreditCard className="w-5 h-5" />}
                        label="Outstanding Balance"
                        value={formatCurrencyLKR(supplier.outstandingBalance)}
                        valueColor={(supplier.outstandingBalance || 0) > 0 ? "text-yellow-300" : "text-white"}
                    />
                </div>
            </div>

            {/* PURCHASE HISTORY */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                <SectionTitle title="Purchase History" />

                {supplier.purchaseHistory?.length ? (
                    <div className="space-y-3 mt-4">
                        {supplier.purchaseHistory.map((p: any, i: number) => (
                            <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary-500/20">
                                        <Receipt className="w-4 h-4 text-primary-400" />
                                    </div>
                                    <div>
                                        <span className="font-medium text-white">Invoice #{p.invoiceNumber || "—"}</span>
                                        <p className="text-xs text-gray-400 mt-1">{p.date ? new Date(p.date).toLocaleDateString("en-GB") : "No date"}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-semibold">{formatCurrencyLKR(p.totalAmount)}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No purchase history available</p>
                    </div>
                )}
            </div>

            {/* PAYMENT HISTORY */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                <SectionTitle title="Payment History" />

                {!supplier.payments || supplier.payments.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No payments recorded</p>
                    </div>
                ) : (
                    <div className="space-y-4 mt-4">
                        {supplier.payments.map((p: ISupplierPayment, i: number) => (
                            <div key={i} className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex md:flex-row flex-col gap-3 md:items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-green-500/20">
                                            <DollarSign className="w-4 h-4 text-green-300" />
                                        </div>
                                        <p className="text-lg font-semibold text-green-300">{formatCurrencyLKR(p.amount)}</p>
                                    </div>

                                    <div className="md:text-right">
                                        <p className="text-sm text-white font-medium">{new Date(p.datePaid).toLocaleDateString("en-GB")}</p>
                                        <p className="text-xs text-gray-400">
                                            {p.paymentMethod === "cash" ? "Cash" : "Online Transfer"}
                                        </p>
                                    </div>
                                </div>

                                {p.notes && (
                                    <div className="mt-3 p-3 bg-black/20 rounded-lg">
                                        <p className="text-xs font-medium text-gray-400 mb-1">Notes</p>
                                        <p className="text-sm text-white">{p.notes}</p>
                                    </div>
                                )}

                                {p.appliedInvoices?.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-xs font-medium text-gray-400 mb-2">Applied Invoices</p>
                                        <div className="space-y-2">
                                            {p.appliedInvoices.map((a, j) => (
                                                <div key={j} className="flex justify-between items-center bg-black/20 p-2 rounded-lg border border-white/5">
                                                    <span className="text-sm text-gray-300">
                                                        Invoice #{a.invoice?.invoiceNumber || a.invoice?._id}
                                                    </span>
                                                    <span className="text-sm font-semibold text-primary-300">
                                                        {formatCurrencyLKR(a.amount)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center pt-4 border-t border-white/10 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Added on {new Date(supplier.createdAt).toLocaleDateString("en-GB")}</span>
                </div>
                <div className="text-right">
                    <span className="text-xs bg-white/5 px-2 py-1 rounded">Supplier ID: {supplier._id?.slice(-8) || "N/A"}</span>
                </div>
            </div>
        </div>
    );
}

/* -------- REUSABLE COMPONENTS -------- */
function Field({ label, value, icon, accent = false }: any) {
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

function FinancialCard({ icon, label, value, valueColor, accent = false }: any) {
    return (
        <div className={`bg-white/5 p-4 rounded-lg border ${accent ? "border-primary-500/30" : "border-white/5"} hover:bg-white/10 transition-colors`}>
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${accent ? "bg-primary-500/20" : "bg-white/10"}`}>
                    {icon}
                </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">{label}</p>
            <p className={`text-lg font-bold ${valueColor}`}>{value}</p>
        </div>
    );
}
