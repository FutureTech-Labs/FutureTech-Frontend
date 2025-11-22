import Image from "next/image";
import { formatCurrencyLKR } from "@/lib/utils";
import { getWarrantyMessage } from "@/lib/warranty";

type InvoiceItem = IPurchaseInvoiceItem | ISalesInvoiceItem;

interface InvoiceEngineProps {
    type: "purchase" | "sales";
    invoice: IPurchaseInvoice | ISalesInvoice;
    items: InvoiceItem[];
}

export default function InvoiceEngine({ type, invoice, items }: InvoiceEngineProps) {
    const isPurchase = type === "purchase";
    const purchaseItems = items as IPurchaseInvoiceItem[];
    const salesItems = items as ISalesInvoiceItem[];

    const isSalesItem = (item: InvoiceItem): item is ISalesInvoiceItem =>
        (item as ISalesInvoiceItem).sellingPrice !== undefined;

    const fromParty = isPurchase
        ? {
            name: (invoice as IPurchaseInvoice).supplier.name,
            email: (invoice as IPurchaseInvoice).supplier.email,
            contact: (invoice as IPurchaseInvoice).supplier.contact,
        }
        : {
            name: "FutureTech Pvt Ltd.",
            email: "contact@futuretech.com",
            contact: "+94 76 853 8824",
            address: "123 Tech Avenue, Colombo 03, Sri Lanka",
        };

    const toParty = isPurchase
        ? {
            name: "FutureTech Pvt Ltd.",
            email: "contact@futuretech.com",
            contact: "+94 76 853 8824",
            address: "123 Tech Avenue, Colombo 03, Sri Lanka",
        }
        : {
            name: (invoice as ISalesInvoice).customer.name,
            email: (invoice as ISalesInvoice).customer.email || "",
            contact: (invoice as ISalesInvoice).customer.contact || "",
        };

    const sales = invoice as ISalesInvoice;

    const displayDate = isPurchase
        ? new Date((invoice as IPurchaseInvoice).date).toLocaleDateString()
        : new Date(sales.createdAt).toLocaleDateString();

    const displayStatus = isPurchase
        ? (invoice as IPurchaseInvoice).status
        : sales.paymentStatus;

    const displayTotal = isPurchase
        ? (invoice as IPurchaseInvoice).totalAmount
        : sales.total;

    const displayPaymentMethod = isPurchase
        ? (invoice as IPurchaseInvoice).paymentType
        : sales.paymentMethod;

    /* ============================================================
       WARRANTY TEXT (sales only)
       ============================================================ */
    const warrantyText = !isPurchase ? getWarrantyMessage(items) : "";

    return (
        <div
            id="invoice-container"
            style={{
                width: "210mm",
                minHeight: "290mm",
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
                        <strong>Date:</strong> {displayDate} <br />

                        {!isPurchase && (
                            <>
                                <br />
                                <strong>Issued by:</strong> {(invoice as ISalesInvoice).createdBy.name} <br />
                                <strong>Payment method:</strong>{" "}
                                {((invoice as ISalesInvoice).paymentMethod || "").toUpperCase()}
                                <br />
                            </>
                        )}

                        <strong>Status:</strong>{" "}
                        <span
                            style={{
                                textTransform: "capitalize",
                                background: displayStatus === "paid" ? "#def7ec" : "#fde8e8",
                                color: displayStatus === "paid" ? "#03543f" : "#9b1c1c",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "0.9em",
                                fontWeight: "bold",
                            }}
                        >
                            {displayStatus}
                        </span>
                    </div>
                </div>
            </div>

            {/* BILL FROM / BILL TO */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
                {/* FROM */}
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
                        {fromParty.address && <>{fromParty.address}<br /></>}
                        {fromParty.email}<br />
                        {fromParty.contact}
                    </div>
                </div>

                {/* TO */}
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
                        {toParty.address && <>{toParty.address}<br /></>}
                        {toParty.email}<br />
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
                        <th style={{ padding: "12px 8px", textTransform: "uppercase" }}>
                            Product Name
                        </th>
                        <th style={{ padding: "12px 8px", width: "60px", textAlign: "center" }}>
                            Qty
                        </th>
                        <th style={{ padding: "12px 8px", width: "120px", textAlign: "center" }}>
                            {isPurchase ? "Cost" : "Price"}
                        </th>

                        {!isPurchase && (
                            <th style={{ padding: "12px 8px", width: "120px", textAlign: "center" }}>
                                Discount
                            </th>
                        )}

                        <th style={{ padding: "12px 8px", width: "120px", textAlign: "center" }}>
                            Total
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {(isPurchase ? purchaseItems : salesItems).map((item) => {
                        const price = isSalesItem(item)
                            ? item.sellingPrice
                            : (item as IPurchaseInvoiceItem).costPrice;

                        const discount = isSalesItem(item) ? item.discount || 0 : 0;

                        const lineTotal = isSalesItem(item)
                            ? item.sellingPrice * item.quantity - discount
                            : (item as IPurchaseInvoiceItem).lineTotal;

                        return (
                            <tr
                                key={item.product?.id || Math.random()}
                                style={{ borderBottom: "1px solid #eee" }}
                            >
                                <td style={{ padding: "12px 8px" }}>
                                    <strong>{item.product?.name}</strong>
                                </td>

                                <td style={{ padding: "12px 8px", textAlign: "center" }}>
                                    {item.quantity}
                                </td>

                                <td style={{ padding: "12px 8px", textAlign: "center" }}>
                                    {formatCurrencyLKR(price)}
                                </td>

                                {!isPurchase && (
                                    <td style={{ padding: "12px 8px", textAlign: "center", color: "#dc2626" }}>
                                        {discount > 0 ? `${formatCurrencyLKR(discount)}` : "—"}
                                    </td>
                                )}

                                <td
                                    style={{
                                        padding: "12px 8px",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {formatCurrencyLKR(lineTotal)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* =====================
                WARRANTY SECTION
               ===================== */}
            {!isPurchase && (() => {
                const normalizedWarranty =
                    Array.isArray(warrantyText)
                        ? warrantyText.join("\n")
                        : warrantyText;

                return (
                    <div style={{ marginBottom: "25px", color: "#666" }}>
                        <h3 style={{ margin: "0 0 5px", fontSize: "10pt" }}>
                            Warranty Information
                        </h3>

                        <div style={{ fontSize: "9pt", lineHeight: "1.4", whiteSpace: "pre-line" }}>
                            {normalizedWarranty
                                .split("\n")
                                .map((line, idx) => (
                                    <div key={idx}>{line}</div>
                                ))}
                        </div>
                    </div>
                );
            })()}


            {/* TOTALS */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ width: "50%", maxWidth: "300px" }}>
                    {!isPurchase && (
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                                <span>Subtotal</span>
                                <span>{formatCurrencyLKR(sales.subtotal)}</span>
                            </div>

                            {sales.discountTotal > 0 && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "8px 0",
                                        color: "#dc2626",
                                    }}
                                >
                                    <span>Discount</span>
                                    <span>- {formatCurrencyLKR(sales.discountTotal)}</span>
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
                        <span>{formatCurrencyLKR(displayTotal)}</span>
                    </div>

                    <div style={{ marginTop: "20px", fontSize: "11px", color: "#666", textAlign: "right" }}>
                        Payment Method:{" "}
                        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
                            {displayPaymentMethod}
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
            </div>
        </div>
    );
}
