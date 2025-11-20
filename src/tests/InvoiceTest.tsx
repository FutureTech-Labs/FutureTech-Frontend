'use client';

import { useState } from "react";
import TestInvoice from "@/components/common/TestInvoice";
import DialogBox from "@/components/common/DialogBox";
import { Button } from "@/components/ui/button";

const InvoiceTest = () => {
    // ---------------- PURCHASE MOCK DATA ----------------
    const mockPurchaseInvoice: IPurchaseInvoice = {
        _id: "PURCHASE_TEST_1",
        invoiceNumber: "PUR-INV-0001",
        date: new Date().toISOString(),
        paymentType: "COD",
        status: "paid",
        totalAmount: 909000,
        supplier: {
            id: "SUP-001",
            name: "Tech Supplier Pvt Ltd",
            contact: "+94 75 323 3241",
            email: "supplier@test.com",
        },
    };

    const mockPurchaseItems: IPurchaseInvoiceItem[] = [
        {
            id: "ITEM-P-01",
            product: { id: "PR-001", name: "Samsung A14" },
            quantity: 3,
            costPrice: 3000,
            lineTotal: 9000,
            batchCode: "BATCH-A1",
        },
        {
            id: "ITEM-P-02",
            product: { id: "PR-002", name: "Motherboard B450M" },
            quantity: 5,
            costPrice: 180000,
            lineTotal: 900000,
            batchCode: "BATCH-B5",
        },
    ];

    // ---------------- SALES MOCK DATA ----------------
    const mockSalesInvoice: ISalesInvoice = {
        _id: "SALES_TEST_1",
        invoiceNumber: "SAL-INV-0001",

        createdAt: new Date().toISOString(),

        createdBy: {
            id: "USER-001",
            name: "Cashier John",
            email: "john@futuretech.com",
            role: "cashier",
        },

        customer: {
            name: "Michael Fernando",
            email: "michael@example.com",
            contact: "+94 77 123 4567",
        },

        items: [
            {
                product: { id: "PR-001", name: "iPhone 12 128GB iphone iphone and this is a iphone" },
                productName: "iPhone 12 128GB",
                quantity: 2,
                sellingPrice: 150000,
                discount: 5000,
                batches: [
                    {
                        batch: "BATCH-001",
                        qty: 1,
                        costPrice: 120000,
                        batchCode: "IP12-1",
                    },
                    {
                        batch: "BATCH-002",
                        qty: 1,
                        costPrice: 118000,
                        batchCode: "IP12-2",
                    },
                ],
            },
            {
                product: { id: "PR-002", name: "Samsung A14" },
                productName: "Samsung A14",
                quantity: 1,
                sellingPrice: 52000,
                discount: 2000,
                batches: [
                    {
                        batch: "BATCH-010",
                        qty: 1,
                        costPrice: 45000,
                        batchCode: "A14-1",
                    },
                ],
            },
        ],

        // FINANCIALS
        subtotal: (150000 * 2) + 52000,   // 352000
        discountTotal: (5000 * 2) + 2000, // 12000
        tax: 0,
        total: 352000 - 12000,            // 340000

        paymentMethod: "cash",
        paymentStatus: "paid",
    };

    const [viewDialogOpen, setviewDialogOpen] = useState<false | "purchase" | "sales">(false);

    return (
        <div className="flex flex-col items-center justify-center gap-4 py-20">

            {/* PURCHASE TEST */}
            <Button onClick={() => setviewDialogOpen("purchase")}>
                Test Purchase Invoice
            </Button>

            {/* SALES TEST */}
            <Button
                className="bg-green-600"
                onClick={() => setviewDialogOpen("sales")}
            >
                Test Sales Invoice
            </Button>

            <DialogBox
                open={!!viewDialogOpen}
                onOpenChange={() => setviewDialogOpen(false)}
                title="Invoice Preview"
                widthClass="max-w-4xl"
            >
                {viewDialogOpen === "purchase" && (
                    <TestInvoice
                        type="purchase"
                        invoice={mockPurchaseInvoice}
                        items={mockPurchaseItems}
                    />
                )}

                {viewDialogOpen === "sales" && (
                    <TestInvoice
                        type="sales"
                        invoice={mockSalesInvoice}
                        items={mockSalesInvoice.items}
                    />
                )}
            </DialogBox>
        </div>
    );
};

export default InvoiceTest;
