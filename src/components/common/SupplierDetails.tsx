"use client";

import React from "react";
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

/* -------------------- LEDGER BUILDER --------------------*/
function buildLedger(supplier: ISupplier) {
    // Guard
    if (!supplier) {
        return { openingBalance: 0, totalPayments: 0, ledger: [] as any[] };
    }

    const payments = supplier.payments ?? [];
    const purchases = supplier.purchaseHistory ?? [];

    const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Opening balance calculation:
    // Keep using the existing idea: outstandingBalance is what's currently owed,
    // so to compute the original opening balance we add back the payments made.
    const openingBalance = (supplier.outstandingBalance || 0) + totalPayments;

    // Build unified events array (purchases are debits, payments are credits)
    const events: {
        type: "purchase" | "payment";
        date: string;
        amount: number;
        description: string;
        raw: any;
    }[] = [];

    purchases.forEach((inv: any) => {
        events.push({
            type: "purchase",
            date: inv.date || inv.createdAt || supplier.createdAt,
            amount: inv.totalAmount || 0,
            description: `Purchase Invoice #${inv.invoiceNumber || inv._id || "—"}`,
            raw: inv,
        });
    });

    payments.forEach((p: any) => {
        events.push({
            type: "payment",
            date: p.datePaid || p.createdAt || supplier.createdAt,
            amount: p.amount || 0,
            description: `Payment (${(p.paymentMethod || "").replace("_", " ") || "—"})`,
            raw: p,
        });
    });

    // Sort chronologically ascending
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Walk through events and compute running balance starting from openingBalance
    let runningBalance = openingBalance;
    const ledger = events.map((e) => {
        if (e.type === "purchase") {
            runningBalance += e.amount;
            return {
                type: "purchase" as const,
                date: e.date,
                description: e.description,
                debit: e.amount,
                credit: 0,
                balance: runningBalance,
            };
        } else {
            // payment
            runningBalance -= e.amount;
            return {
                type: "payment" as const,
                date: e.date,
                description: e.description,
                debit: 0,
                credit: e.amount,
                balance: runningBalance,
            };
        }
    });

    return { openingBalance, totalPayments, ledger };
}

/* -------------------- MAIN COMPONENT -------------------- */

export default function SupplierDetails({ supplier }: SupplierDetailsProps) {
    if (!supplier) return null;

    const isPending = supplier.status === "pending";
    const { openingBalance, totalPayments, ledger } = buildLedger(supplier);

    // Current balance / outstanding from supplier (should equal last ledger balance if ledger exists)
    const currentBalance =
        ledger.length > 0 ? ledger[ledger.length - 1].balance : openingBalance;

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
                {/* CONTACT SECTION */}
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
                        <Field
                            icon={<Landmark className="w-4 h-4" />}
                            label="Bank Name"
                            value={supplier.bankDetails?.bankName}
                        />
                        <Field
                            icon={<CreditCard className="w-4 h-4" />}
                            label="Account Number"
                            value={supplier.bankDetails?.accountNumber}
                        />
                    </div>
                </div>
            </div>

            {/* FINANCIAL OVERVIEW */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                <SectionTitle title="Financial Overview" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <FinancialCard
                        icon={<FileText className="w-5 h-5" />}
                        label="Opening Balance"
                        value={formatCurrencyLKR(openingBalance)}
                        valueColor="text-white"
                    />
                    <FinancialCard
                        icon={<DollarSign className="w-5 h-5" />}
                        label="Total Payments"
                        value={formatCurrencyLKR(totalPayments)}
                        valueColor="text-green-300"
                    />
                    <FinancialCard
                        icon={<CreditCard className="w-5 h-5" />}
                        label="Outstanding"
                        value={formatCurrencyLKR(supplier.outstandingBalance)}
                        valueColor={(supplier.outstandingBalance || 0) > 0 ? "text-yellow-300" : "text-white"}
                    />
                    <FinancialCard
                        icon={<Receipt className="w-5 h-5" />}
                        label="Current Balance"
                        value={formatCurrencyLKR(currentBalance)}
                        valueColor="text-primary-300"
                        accent
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
                                        <p className="text-xs text-gray-400 mt-1">
                                            {p.date ? new Date(p.date).toLocaleDateString("en-GB") : "No date"}
                                        </p>
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
                            <div
                                key={i}
                                className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                            >
                                {/* Top Row: Amount + Date */}
                                <div className="flex md:flex-row flex-col gap-3 md:items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-green-500/20">
                                            <DollarSign className="w-4 h-4 text-green-300" />
                                        </div>
                                        <p className="text-lg font-semibold text-green-300">
                                            {formatCurrencyLKR(p.amount)}
                                        </p>
                                    </div>

                                    <div className="md:text-right">
                                        <p className="text-sm text-white font-medium">
                                            {new Date(p.datePaid).toLocaleDateString("en-GB")}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {p.paymentMethod === "cash" ? "Cash" : "Online Transfer"}
                                        </p>
                                    </div>
                                </div>

                                {/* Notes */}
                                {p.notes && (
                                    <div className="mt-3 p-3 bg-black/20 rounded-lg">
                                        <p className="text-xs font-medium text-gray-400 mb-1">Notes</p>
                                        <p className="text-sm text-white">{p.notes}</p>
                                    </div>
                                )}

                                {/* Applied Invoices */}
                                {p.appliedInvoices?.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-xs font-medium text-gray-400 mb-2">Applied Invoices</p>
                                        <div className="space-y-2">
                                            {p.appliedInvoices.map((a, j) => (
                                                <div
                                                    key={j}
                                                    className="flex justify-between items-center bg-black/20 p-2 rounded-lg border border-white/5"
                                                >
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

            {/* LEDGER */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                <SectionTitle title="Transaction Ledger" />

                {ledger.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No ledger records available</p>
                    </div>
                ) : (
                    <div className="space-y-3 mt-4">
                        {ledger.map((entry, i) => (
                            <div key={i} className="bg-white/5 p-4 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-medium text-white">
                                        {entry.description}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(entry.date).toLocaleDateString("en-GB")}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex gap-4">
                                        {entry.debit > 0 && (
                                            <div className="text-sm">
                                                <span className="text-gray-400 text-xs">Debit:</span>
                                                <span className="text-red-300 font-medium ml-1">
                                                    {formatCurrencyLKR(entry.debit)}
                                                </span>
                                            </div>
                                        )}
                                        {entry.credit > 0 && (
                                            <div className="text-sm">
                                                <span className="text-gray-400 text-xs">Credit:</span>
                                                <span className="text-green-300 font-medium ml-1">
                                                    {formatCurrencyLKR(entry.credit)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <span className="text-xs text-gray-400 block">Balance</span>
                                        <span className="text-primary-300 font-semibold">
                                            {formatCurrencyLKR(entry.balance)}
                                        </span>
                                    </div>
                                </div>
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