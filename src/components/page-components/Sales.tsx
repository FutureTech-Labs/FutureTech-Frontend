"use client";

import { useState } from "react";
import Invoice from "../common/Invoice";
import SalesForm from "../forms/SalesForm";
import DialogBox from "../common/DialogBox";
import SalesCart from "../common/sales/SalesCart";
import SalesProductSelector from "../common/sales/SalesProductSelector";

export default function SalesPage() {

    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
    const [invoiceData, setInvoiceData] = useState<IGetSaleByIdResponse | null>(null);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">

            {/* LEFT SIDE — ComboBox + Product Grid */}
            <SalesProductSelector />

            {/* RIGHT SIDE — Cart + Form */}
            <div className="flex flex-col gap-6">
                <SalesCart />
                <SalesForm
                    onSuccess={(data) => {
                        setInvoiceData(data);
                        setInvoiceDialogOpen(true);
                    }}
                />
            </div>

            {/* INVOICE POPUP! */}
            <DialogBox
                open={invoiceDialogOpen}
                onOpenChange={setInvoiceDialogOpen}
                title="Sales Invoice"
                widthClass="md:min-w-3xl!"
            >
                {invoiceData && (
                    <Invoice
                        type="sales"
                        invoice={invoiceData.invoice}
                        items={invoiceData.invoice.items}
                    />
                )}
            </DialogBox>
        </div>
    );
}
