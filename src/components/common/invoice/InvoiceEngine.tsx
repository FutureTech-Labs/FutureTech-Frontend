import Image from "next/image";
import { formatCurrencyLKR } from "@/lib/utils";

type InvoiceItem = IPurchaseInvoiceItem | ISalesInvoiceItem;

interface InvoiceEngineProps {
    type: "purchase" | "sales";
    invoice: IPurchaseInvoice | ISalesInvoice;
    items: InvoiceItem[];
}

export default function InvoiceEngine({
    type,
    invoice,
    items,
}: InvoiceEngineProps) {
    const isPurchase = type === "purchase";
    const purchaseItems = items as IPurchaseInvoiceItem[];
    const salesItems = items as ISalesInvoiceItem[];

    const fromParty = isPurchase
        ? ({
            ...((invoice as IPurchaseInvoice).supplier ?? {}),
            address: "N/A",
        } as IInvoiceParty & { address?: string })
        : ({
            id: "ft-001",
            name: "FutureTech Pvt Ltd.",
            email: "contact@futuretech.com",
            contact: "+94 76 853 8824",
            address: "123 Tech Avenue, Colombo 03, Sri Lanka",
        } as IInvoiceParty & { address?: string });

    const toParty = isPurchase
        ? ({
            id: "ft-001",
            name: "FutureTech Pvt Ltd.",
            email: "contact@futuretech.com",
            contact: "+94 76 853 8824",
            address: "123 Tech Avenue, Colombo 03, Sri Lanka",
        } as IInvoiceParty & { address?: string })
        : ({
            ...((invoice as ISalesInvoice).customer ?? {}),
            address: "N/A",
        } as IInvoiceParty & { address?: string });

    const discountAmount =
        !isPurchase && (invoice as ISalesInvoice).discount
            ? ((invoice as ISalesInvoice).subtotal *
                (invoice as ISalesInvoice).discount) /
            100
            : 0;

    return (
        <div
            id="invoice-container"
            style={{
                width: "210mm",
                minHeight: "297mm",
                margin: "0 auto",
                padding: "15mm",
                backgroundColor: "#ffffff",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                color: "#333",
                boxSizing: "border-box",
                position: "relative",
                fontSize: "10pt",
            }}
        >
            <style>
                {`@media print {
            @page { size: A4; margin: 0; }
            body { margin: 0; -webkit-print-color-adjust: exact; }
            #invoice-container { width: 100%; height: 100%; margin: 0; box-shadow: none; }}
        `}
            </style>

            {/* HEADER */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    borderBottom: "2px solid #eee",
                    paddingBottom: "20px",
                    marginBottom: "30px",
                }}
            >
                <div>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                        <img
                            src="/images/FutureTechLogo.png"
                            alt="FutureTech Logo"
                            width={30}
                            height={30}
                            style={{ marginRight: "10px" }}
                        />
                        <h2 style={{ margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
                            FutureTech
                        </h2>
                    </div>

                    {/* ALWAYS FutureTech details - NOT supplier */}
                    <div style={{ color: "#666", lineHeight: "1.4" }}>
                        123 Tech Avenue, Colombo 03, Sri Lanka <br />
                        contact@futuretech.com <br />
                        +94 76 853 8824
                    </div>
                </div>



                <div style={{ textAlign: "right" }}>
                    <h1
                        style={{
                            fontSize: "24pt",
                            margin: "0 0 10px 0",
                            color: "#000",
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                        }}
                    >
                        {isPurchase ? "Purchase Invoice" : "Invoice"}
                    </h1>

                    <div style={{ lineHeight: "1.6" }}>
                        <strong>Invoice number:</strong> {invoice.invoiceNumber} <br />
                        <strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()} <br />
                        <strong>Status:</strong>{" "}
                        <span
                            style={{
                                textTransform: "capitalize",
                                background: invoice.status === "paid" ? "#def7ec" : "#fde8e8",
                                color: invoice.status === "paid" ? "#03543f" : "#9b1c1c",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "0.9em",
                                fontWeight: "bold",
                            }}
                        >
                            {invoice.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* BILL FROM / BILL TO */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "40px",
                }}
            >
                <div style={{ width: "45%" }}>
                    <h3
                        style={{
                            fontSize: "10pt",
                            color: "#888",
                            textTransform: "uppercase",
                            borderBottom: "1px solid #eee",
                            paddingBottom: "5px",
                            marginBottom: "10px",
                        }}
                    >
                        Bill From
                    </h3>
                    <strong>{fromParty.name}</strong>
                    <div style={{ color: "#555", marginTop: "5px", lineHeight: "1.4" }}>
                        {fromParty.address} <br />
                        {fromParty.email} <br />
                        {fromParty.contact}
                    </div>
                </div>

                <div style={{ width: "45%" }}>
                    <h3
                        style={{
                            fontSize: "10pt",
                            color: "#888",
                            textTransform: "uppercase",
                            borderBottom: "1px solid #eee",
                            paddingBottom: "5px",
                            marginBottom: "10px",
                        }}
                    >
                        Bill To
                    </h3>
                    <strong>{toParty.name}</strong>
                    <div style={{ color: "#555", marginTop: "5px", lineHeight: "1.4" }}>
                        {toParty.address} <br />
                        {toParty.email} <br />
                        {toParty.contact}
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "30px",
                }}
            >
                <thead>
                    <tr
                        style={{
                            backgroundColor: "#f8f9fa",
                            borderBottom: "2px solid #000",
                            textAlign: "left",
                        }}
                    >
                        <th style={{ padding: "12px 8px", fontSize: "11px", textTransform: "uppercase" }}>
                            Product / Description
                        </th>
                        <th style={{ padding: "12px 8px", fontSize: "11px", textTransform: "uppercase", width: "60px", textAlign: "center" }}>
                            Qty
                        </th>
                        <th style={{ padding: "12px 8px", fontSize: "11px", textTransform: "uppercase", width: "120px", textAlign: "right" }}>
                            {isPurchase ? "Cost" : "Price"}
                        </th>
                        <th style={{ padding: "12px 8px", fontSize: "11px", textTransform: "uppercase", width: "120px", textAlign: "right" }}>
                            Total
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {(isPurchase ? purchaseItems : salesItems).map((item) => (
                        <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "12px 8px" }}>
                                <strong>{item.product?.name}</strong>
                            </td>
                            <td style={{ padding: "12px 8px", textAlign: "center" }}>
                                {item.quantity}
                            </td>
                            <td style={{ padding: "12px 8px", textAlign: "right" }}>
                                {formatCurrencyLKR(
                                    isPurchase
                                        ? (item as IPurchaseInvoiceItem).costPrice
                                        : (item as ISalesInvoiceItem).sellingPrice
                                )}
                            </td>
                            <td style={{ padding: "12px 8px", textAlign: "right", fontWeight: "bold" }}>
                                {formatCurrencyLKR(item.lineTotal)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* TOTALS */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ width: "50%", maxWidth: "300px" }}>
                    {!isPurchase && (
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", color: "#555" }}>
                                <span>Subtotal</span>
                                <span>{formatCurrencyLKR((invoice as ISalesInvoice).subtotal)}</span>
                            </div>

                            {(invoice as ISalesInvoice).discount > 0 && (
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", color: "#dc2626" }}>
                                    <span>Discount ({(invoice as ISalesInvoice).discount}%)</span>
                                    <span>- {formatCurrencyLKR(discountAmount)}</span>
                                </div>
                            )}
                        </>
                    )}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "15px 0",
                            borderTop: "2px solid #000",
                            marginTop: "10px",
                            fontWeight: "bold",
                            fontSize: "14pt",
                        }}
                    >
                        <span>Total</span>
                        <span>{formatCurrencyLKR(invoice.totalAmount)}</span>
                    </div>

                    <div style={{ marginTop: "20px", fontSize: "11px", color: "#666", textAlign: "right" }}>
                        Payment Method:{" "}
                        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
                            {invoice.paymentType}
                        </span>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div
                style={{
                    position: "absolute",
                    bottom: "15mm",
                    left: "15mm",
                    right: "15mm",
                    textAlign: "center",
                    color: "#999",
                    fontSize: "9pt",
                    borderTop: "1px solid #eee",
                    paddingTop: "15px",
                }}
            >
                <p style={{ margin: 0, fontWeight: "bold", color: "#333", marginBottom: "5px" }}>
                    Thank you for your business!
                </p>
                <p style={{ margin: 0 }}>
                    FutureTech Pvt Ltd. | Reg No: PV 12345 | 123 Tech Avenue, Colombo 03
                </p>
                <p style={{ margin: 0 }}>questions? email us at contact@futuretech.com</p>
            </div>
        </div>
    );
}
